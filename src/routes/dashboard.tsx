import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useId } from "react";
import {
  Wallet, Send, ArrowDownLeft, ArrowUpRight, Plus, CreditCard,
  Receipt, TrendingUp, ShieldCheck, Eye, EyeOff, Lock, User,
  Globe, Bell, Settings, LogOut, CheckCircle2, AlertCircle,
  Search, Filter, Download, ChevronRight, ThumbsUp, RefreshCw,
  Phone, Mail, MapPin, Building2, Calendar, Zap, Smartphone,
  Wifi, Droplets, Tv, Check, X, Shield, Key, ShieldAlert
} from "lucide-react";
import { useBanking } from "@/lib/banking-context";
import { btnPrimary } from "@/components/site/Layout";
import {
  ELIGIBLE_INTERNATIONAL_COUNTRIES,
  BILL_PROVIDERS,
  EXCHANGE_RATES,
  Transaction,
  Beneficiary
} from "@/lib/banking-store";


export const Route = createFileRoute("/dashboard")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Client Dashboard — Varenta Bank" },
      { name: "description", content: "Personal and private wealth management portal for Varenta Bank clients." },
    ],
  }),
  component: DashboardPage,
});

type TabType =
  | "overview"
  | "transfers"
  | "bills"
  | "cards"
  | "converter"
  | "transactions"
  | "profile"
  | "beneficiaries";

export function DashboardPage() {
  const navigate = useNavigate();
  const {
    user,
    accounts,
    totalBalance,
    isMasked,
    toggleMask,
    card,
    transactions,
    beneficiaries,
    notifications,
    updateProfile,
    toggleCardFreeze,
    updateCardLimit,
    depositFunds,
    transferDomestic,
    transferInternational,
    payBill,
    convertCurrency,
    addBeneficiary,
    removeBeneficiary,
    markNotificationsRead,
  } = useBanking();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showNotifications, setShowNotifications] = useState(false);

  // Modals state
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(5000);
  const [depositMethod, setDepositMethod] = useState("Federal Reserve Wire (Fedwire / RTGS)");
  const [depositTarget, setDepositTarget] = useState<"Current Account" | "Savings Account">("Current Account");
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);

  // 3D Debit Card interactive flip state
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showCardCvv, setShowCardCvv] = useState(false);

  // Domestic Transfer Form
  const [domForm, setDomForm] = useState({
    recipientName: "",
    bankName: "JPMorgan Chase Bank, N.A.",
    accountNumber: "",
    bankAddress: "270 Park Ave, New York, NY 10017",
    amount: "",
    description: "",
    pin: "4820",
  });
  const [domError, setDomError] = useState("");
  const [domSuccess, setDomSuccess] = useState<Transaction | null>(null);
  const [isTransferringDom, setIsTransferringDom] = useState(false);

  // International Transfer Form (Eligible countries outside Africa)
  const [intlForm, setIntlForm] = useState({
    recipientName: "",
    country: ELIGIBLE_INTERNATIONAL_COUNTRIES[0]?.name ?? "",
    bankName: "Barclays Bank UK PLC",
    swiftBic: "BARCGB22",
    iban: "",
    currency: "GBP",
    amount: "",
    description: "",
    pin: "4820",
  });
  const [intlError, setIntlError] = useState("");
  const [intlSuccess, setIntlSuccess] = useState<Transaction | null>(null);
  const [isTransferringIntl, setIsTransferringIntl] = useState(false);

  // Currency Converter State
  const [convAmount, setConvAmount] = useState<number>(1000);
  const [convFrom, setConvFrom] = useState<string>("USD");
  const [convTo, setConvTo] = useState<string>("EUR");

  // Bill Payment State
  const [billCategory, setBillCategory] = useState<keyof typeof BILL_PROVIDERS>("Electricity");
  const [billProvider, setBillProvider] = useState(BILL_PROVIDERS.Electricity[0]?.name ?? "");
  const [billAccount, setBillAccount] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billReceipt, setBillReceipt] = useState<string | null>(null);
  const [billError, setBillError] = useState("");
  const [isPayingBill, setIsPayingBill] = useState(false);

  // Transaction Filters
  const [txnSearch, setTxnSearch] = useState("");
  const [txnTypeFilter, setTxnTypeFilter] = useState("All");

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ ...user });
  const [profileSavedMsg, setProfileSavedMsg] = useState("");

  // New Beneficiary Form
  const [showAddBen, setShowAddBen] = useState(false);
  const [newBen, setNewBen] = useState({
    name: "",
    bankName: "",
    accountNumber: "",
    swiftBic: "",
    country: "United States",
    currency: "USD",
    type: "domestic" as "domestic" | "international",
  });

  // Format currency helper honoring mask state
  const formatMoney = (val: number, curr = "USD") => {
    if (isMasked) return "••••••";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: curr }).format(val);
  };

  const maskString = (str: string, keepEnd = 4) => {
    if (!isMasked) return str;
    if (str.length <= keepEnd) return "••••";
    return "•••• •••• " + str.slice(-keepEnd);
  };

  // Handle Deposit
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingDeposit(true);
    await depositFunds(Number(depositAmount), depositTarget, depositMethod);
    setIsProcessingDeposit(false);
    setShowDepositModal(false);
  };

  // Handle Domestic Transfer
  const handleDomesticTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setDomError("");
    setDomSuccess(null);
    setIsTransferringDom(true);

    const res = await transferDomestic({
      recipientName: domForm.recipientName,
      bankName: domForm.bankName,
      accountNumber: domForm.accountNumber,
      bankAddress: domForm.bankAddress,
      amount: Number(domForm.amount),
      description: domForm.description,
      pin: domForm.pin,
    });

    setIsTransferringDom(false);
    if (res.success && res.txn) {
      setDomSuccess(res.txn);
      setDomForm((prev) => ({ ...prev, amount: "", description: "" }));
    } else if (res.error) {
      setDomError(res.error);
    }
  };

  // Handle International Transfer
  const handleIntlTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIntlError("");
    setIntlSuccess(null);
    setIsTransferringIntl(true);

    const amountNum = Number(intlForm.amount);
    const conv = convertCurrency(amountNum, "USD", intlForm.currency);

    const res = await transferInternational({
      recipientName: intlForm.recipientName,
      country: intlForm.country,
      bankName: intlForm.bankName,
      swiftBic: intlForm.swiftBic,
      iban: intlForm.iban,
      currency: intlForm.currency,
      amount: amountNum,
      exchangeRate: conv.rate,
      convertedAmount: conv.converted,
      fee: 0.0,
      description: intlForm.description,
      pin: intlForm.pin,
    });

    setIsTransferringIntl(false);
    if (res.success && res.txn) {
      setIntlSuccess(res.txn);
      setIntlForm((prev) => ({ ...prev, amount: "", description: "" }));
    } else if (res.error) {
      setIntlError(res.error);
    }
  };

  // Handle Bill Payment
  const handleBillPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBillError("");
    setBillReceipt(null);
    setIsPayingBill(true);

    const res = await payBill({
      category: billCategory,
      provider: billProvider,
      accountNumber: billAccount,
      amount: Number(billAmount),
    });

    setIsPayingBill(false);
    if (res.success) {
      setBillReceipt(res.receiptNumber);
      setBillAmount("");
      setBillAccount("");
    } else if (res.error) {
      setBillError(res.error);
    }
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(txnSearch.toLowerCase()) ||
      t.recipientOrSender.toLowerCase().includes(txnSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(txnSearch.toLowerCase());
    const matchesType = txnTypeFilter === "All" || t.type === txnTypeFilter;
    return matchesSearch && matchesType;
  });

  // Download statement generator
  const downloadStatement = () => {
    const lines = [
      "============================================================",
      "                 VARENTA BANK STATEMENT                    ",
      "============================================================",
      `Client Name:   ${user.firstName} ${user.lastName}`,
      `Account Number: ${user.accountNumber}`,
      `Generated At:  ${new Date().toISOString()}`,
      `Total Balance: $${totalBalance.toFixed(2)} USD`,
      "------------------------------------------------------------",
      "ID           | Date        | Type             | Amount     | Status",
      "------------------------------------------------------------",
      ...transactions.map(
        (t) =>
          `${t.id} | ${t.date} | ${t.type.padEnd(16)} | $${t.amount.toFixed(2).padStart(8)} | ${t.status}`
      ),
      "============================================================",
      "Varenta Bank Member FDIC • Real-time Solvency Verified",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Varenta_Statement_${user.accountNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentAcc = accounts.find((a) => a.type === "Current Account") || accounts[0];
  const savingsAcc = accounts.find((a) => a.type === "Savings Account") || accounts[1];

  if (!currentAcc || !savingsAcc) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <p className="max-w-sm text-sm text-muted-foreground">
          No accounts are open yet. Open an account to see your dashboard.
        </p>
      </div>
    );
  }


  const convResult = convertCurrency(convAmount, convFrom, convTo);

  return (
    <div className="min-h-screen bg-ink text-foreground flex flex-col antialiased">
      {/* ================= TOP APPLICATION HEADER ================= */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-background/80 backdrop-blur-2xl px-4 py-3 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                V
              </span>
              <span className="hidden sm:inline">
                Varenta<span className="text-primary"> Bank</span>
              </span>
            </Link>
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary tracking-wider uppercase font-mono">
              Client Portal
            </span>
          </div>

          {/* Right Action Icons: Eye Toggle, Notifications, User Chip */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Admin Portal Link */}
            <Link
              to="/admin"
              className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 flex items-center gap-1.5 transition-all shadow-sm"
              title="Open Treasury & Admin Operations Desk"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Admin Desk</span>
            </Link>

            {/* Global Sensitive Information Privacy Toggle (Eye Icon) */}
            <button
              type="button"
              onClick={toggleMask}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all ${
                isMasked
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                  : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20"
              }`}
              title={isMasked ? "Click to reveal sensitive financial balances" : "Click to hide sensitive financial balances"}
            >
              {isMasked ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="hidden sm:inline">
                {isMasked ? "Details Hidden" : "Details Visible"}
              </span>
            </button>

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  markNotificationsRead();
                }}
                className="relative grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-background/60 hover:bg-accent text-muted-foreground hover:text-foreground"
                aria-label="View notifications"
              >
                <Bell className="h-4 w-4" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                )}
              </button>

              {/* Notifications Dropdown Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-3xl border border-white/20 bg-background/95 p-4 shadow-2xl backdrop-blur-2xl z-50 animate-rise">
                  <div className="flex items-center justify-between pb-2 border-b border-border/40">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Notifications
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 rounded-full text-muted-foreground hover:bg-accent"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="rounded-2xl border border-border/40 bg-muted/20 p-2.5 text-xs text-muted-foreground"
                      >
                        <p className="text-foreground font-medium">{n.title}</p>
                        <span className="text-[10px] text-muted-foreground mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-background/60 p-1 pr-3 hover:bg-accent transition-all"
            >
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.firstName}
                  className="h-7 w-7 rounded-full object-cover border border-primary/50"
                />
              ) : (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">
                  {user.firstName.charAt(0)}
                </span>
              )}
              <span className="text-xs font-semibold text-foreground hidden md:inline">
                {user.firstName}
              </span>
            </button>

            {/* Logout Button */}
            <Link
              to="/login"
              className="grid h-9 w-9 place-items-center rounded-full border border-border/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Secure Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= MAIN DASHBOARD BODY ================= */}
      <div className="flex-1 mx-auto flex w-full max-w-7xl">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-white/10 p-6">
          <div className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: Wallet },
              { id: "transfers", label: "Transfers", icon: Send },
              { id: "bills", label: "Bill Payments", icon: Receipt },
              { id: "cards", label: "Virtual Card", icon: CreditCard },
              { id: "converter", label: "FX Converter", icon: RefreshCw },
              { id: "transactions", label: "Statement & History", icon: Calendar },
              { id: "beneficiaries", label: "Beneficiaries", icon: Building2 },
              { id: "profile", label: "Client Profile", icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-glow scale-[1.02]"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <Link
              to="/admin"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold text-primary hover:bg-primary/15 border border-primary/30 bg-primary/5 transition-all mt-3"
            >
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Admin Operations Desk</span>
            </Link>
          </div>

          {/* Quick Security Status Box */}
          <div className="rounded-3xl border border-white/15 bg-white/5 p-4 text-xs backdrop-blur-xl">
            <div className="flex items-center gap-2 text-green-400 font-bold mb-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Biometric KYC: {user.status}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              21-Jurisdiction compliance verified. 256-bit session encrypted.
            </p>
          </div>
        </aside>

        {/* Dynamic Center Work Area */}
        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 overflow-x-hidden">
          {/* ================= TAB 1: OVERVIEW ================= */}
          {activeTab === "overview" && (
            <div className="animate-rise space-y-8">
              {/* Personalized Welcome Banner */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Welcome back, <span className="text-gradient">{user.firstName}</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    Account Status: <strong className="text-green-400">{user.status}</strong> • Client ID: {maskString(user.accountNumber, 4)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDepositModal(true)}
                    className={`${btnPrimary} py-2 text-xs`}
                  >
                    <Plus className="h-4 w-4" /> Deposit Funds
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("transfers")}
                    className="glass inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-5 text-xs font-semibold text-foreground hover:bg-accent"
                  >
                    <Send className="h-3.5 w-3.5" /> Transfer
                  </button>
                </div>
              </div>

              {/* Total Balance & Account Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Total Balance Card */}
                <div className="rounded-3xl bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 p-6 text-white shadow-glow relative overflow-hidden sm:col-span-1">
                  <div className="pointer-events-none absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-white/10 blur-xl" />
                  <div className="flex items-center justify-between text-xs opacity-90">
                    <span>Total Balance</span>
                    <button onClick={toggleMask} className="p-1 hover:opacity-100">
                      {isMasked ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight">
                    {formatMoney(totalBalance, user.preferredCurrency)}
                  </p>
                  <p className="mt-4 text-[11px] opacity-80 font-mono">
                    Initial Balance: $0.00 USD
                  </p>
                </div>

                {/* Current Account Card */}
                <div className="glass rounded-3xl p-6 border border-white/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">Current Account</span>
                      <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-bold text-primary">
                        PRIMARY
                      </span>
                    </div>
                    <p className="mt-3 font-display text-2xl font-bold text-foreground">
                      {formatMoney(currentAcc.balance, currentAcc.currency)}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground font-mono flex items-center justify-between">
                    <span>{maskString(currentAcc.accountNumber, 4)}</span>
                    <span className="text-green-400 font-semibold">Active</span>
                  </div>
                </div>

                {/* Savings Account Card */}
                <div className="glass rounded-3xl p-6 border border-white/20 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-semibold">High-Yield Savings</span>
                      <span className="rounded-full bg-green-500/10 border border-green-500/30 px-2 py-0.5 text-[10px] font-bold text-green-400 font-mono">
                        5.15% APY
                      </span>
                    </div>
                    <p className="mt-3 font-display text-2xl font-bold text-foreground">
                      {formatMoney(savingsAcc.balance, savingsAcc.currency)}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground font-mono flex items-center justify-between">
                    <span>{maskString(savingsAcc.accountNumber, 4)}</span>
                    <span className="text-primary font-semibold">Daily Compounding</span>
                  </div>
                </div>
              </div>

              {/* Interactive Virtual Debit Card & Quick Actions */}
              <div className="grid gap-6 lg:grid-cols-12 items-start">
                {/* 3D Interactive Virtual Debit Card */}
                <div className="lg:col-span-6 rounded-3xl border border-white/20 bg-background/60 p-6 backdrop-blur-xl shadow-glass flex flex-col items-center">
                  <div className="w-full flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Virtual Debit Card (Click to Flip 3D)
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        card.isFrozen
                          ? "bg-destructive/20 text-destructive border border-destructive/40"
                          : "bg-green-500/20 text-green-400 border border-green-500/40"
                      }`}
                    >
                      {card.isFrozen ? "FROZEN" : "ACTIVE"}
                    </span>
                  </div>

                  {/* 3D Rotating Card Container */}
                  <div
                    className="relative h-52 w-full max-w-[340px] cursor-pointer select-none transition-transform duration-500"
                    style={{ perspective: "1000px" }}
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    title="Click card to flip between front and back"
                  >
                    <div
                      className="relative h-full w-full rounded-3xl transition-transform duration-700"
                      style={{
                        transformStyle: "preserve-3d",
                        transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      }}
                    >
                      {/* CARD FRONT */}
                      <div
                        className="absolute inset-0 rounded-3xl border border-white/30 bg-gradient-to-br from-neutral-900 via-zinc-900 to-black p-5 text-white shadow-2xl overflow-hidden flex flex-col justify-between"
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="grid h-7 w-7 place-items-center rounded-xl bg-gradient-primary text-xs font-bold">
                              V
                            </span>
                            <span className="font-display text-xs font-bold tracking-wider">
                              VARENTA
                            </span>
                          </div>
                          <Wifi className="h-4 w-4 rotate-90 text-amber-400" />
                        </div>

                        {/* EMV Microchip */}
                        <div className="my-1 flex items-center gap-3">
                          <div className="h-8 w-11 rounded-lg border border-amber-300/60 bg-gradient-to-tr from-amber-300 via-amber-400 to-yellow-600 shadow-inner" />
                          <span className="text-[10px] font-mono text-amber-300/80">WORLD ELITE</span>
                        </div>

                        {/* Card Number */}
                        <div className="font-mono text-base font-bold tracking-widest text-zinc-100">
                          {isMasked ? "•••• •••• •••• 8842" : card.cardNumber}
                        </div>

                        {/* Bottom Row */}
                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-[8px] uppercase tracking-wider text-muted-foreground block">
                              Cardholder
                            </span>
                            <span className="font-mono text-xs font-bold text-zinc-200">
                              {user.firstName.toUpperCase()} {user.lastName.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] uppercase tracking-wider text-muted-foreground block">
                              Expires
                            </span>
                            <span className="font-mono text-xs font-bold text-zinc-200">
                              {card.expiryDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* CARD BACK */}
                      <div
                        className="absolute inset-0 rounded-3xl border border-white/20 bg-gradient-to-bl from-black via-zinc-950 to-neutral-900 pt-4 text-white shadow-2xl overflow-hidden flex flex-col justify-between"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                      >
                        <div className="h-9 w-full bg-neutral-900 border-y border-neutral-700/60" />
                        <div className="px-5">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 rounded bg-neutral-200 px-3 py-1 font-mono text-[9px] text-neutral-800 italic">
                              Authorized Signature
                            </div>
                            <div className="rounded bg-white px-2 py-1 font-mono text-xs font-bold text-black flex items-center gap-1">
                              <span className="text-[8px] text-neutral-500">CVV</span>
                              <span>{showCardCvv || !isMasked ? card.cvv : "•••"}</span>
                            </div>
                          </div>
                          <p className="mt-3 text-[8px] leading-relaxed text-zinc-400 font-mono">
                            Issued by Varenta Bank pursuant to license by World Elite. 24/7 International Desk.
                          </p>
                        </div>
                        <div className="px-5 pb-3 text-[8px] text-zinc-500 font-mono flex items-center justify-between border-t border-white/10 pt-1">
                          <span>FDIC INSURED • 256-BIT CHIP</span>
                          <span className="text-amber-400">CLICK TO FLIP FRONT</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Controls */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCardFreeze();
                      }}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                        card.isFrozen
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "border border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20"
                      }`}
                    >
                      {card.isFrozen ? "Unfreeze Card" : "Freeze Card"}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCardCvv(!showCardCvv);
                      }}
                      className="rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-foreground hover:bg-muted"
                    >
                      {showCardCvv ? "Hide CVV" : "Show CVV"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("cards")}
                      className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs text-primary font-semibold hover:bg-primary/20"
                    >
                      Manage Limits
                    </button>
                  </div>
                </div>

                {/* Quick Actions & Recent Transactions summary */}
                <div className="lg:col-span-6 space-y-6">
                  {/* Quick Action Matrix */}
                  <div className="rounded-3xl border border-white/20 bg-background/60 p-6 backdrop-blur-xl shadow-glass">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-4">
                      Instant Banking Actions
                    </span>
                    <div className="grid grid-cols-4 gap-3 text-center">
                      {[
                        { label: "Domestic", icon: Send, tab: "transfers" },
                        { label: "Int'l Wire", icon: Globe, tab: "transfers" },
                        { label: "Pay Bills", icon: Receipt, tab: "bills" },
                        { label: "Statements", icon: Calendar, tab: "transactions" },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setActiveTab(item.tab as TabType)}
                            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/40 bg-muted/20 p-3 hover:bg-primary/15 hover:border-primary/40 transition-all group"
                          >
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground group-hover:scale-110 transition-transform">
                              <Icon className="h-5 w-5" />
                            </span>
                            <span className="text-[11px] font-semibold text-foreground">
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity Mini-Feed */}
                  <div className="rounded-3xl border border-white/20 bg-background/60 p-6 backdrop-blur-xl shadow-glass">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Recent Activity
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab("transactions")}
                        className="text-xs text-primary hover:underline font-semibold"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-3">
                      {transactions.slice(0, 3).map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between rounded-2xl border border-border/30 bg-muted/20 p-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`grid h-8 w-8 place-items-center rounded-full ${
                                t.amount > 0 ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"
                              }`}
                            >
                              {t.amount > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                            </span>
                            <div>
                              <p className="font-semibold text-foreground">{t.recipientOrSender}</p>
                              <span className="text-[10px] text-muted-foreground">{t.type} • {t.date}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-mono font-bold ${
                                t.amount > 0 ? "text-green-400" : "text-foreground"
                              }`}
                            >
                              {t.amount > 0 ? "+" : ""}{formatMoney(t.amount, t.currency)}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[9px] text-primary font-semibold">
                              <ThumbsUp className="h-2.5 w-2.5" /> Approved
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: TRANSFERS (DOMESTIC & INTERNATIONAL) ================= */}
          {activeTab === "transfers" && (
            <div className="animate-rise space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Move Funds <span className="text-gradient">Globally & Locally</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Send domestic ACH/Fedwire payments or execute SWIFT/RTGS international wires to eligible non-African countries.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* 1. DOMESTIC TRANSFERS */}
                <div className="glass rounded-[2rem] p-6 sm:p-8 border border-white/20 shadow-glass">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <Send className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-base text-foreground">Domestic Wire / ACH</h3>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary font-mono">
                      FEE: $0.00
                    </span>
                  </div>

                  {domSuccess && (
                    <div className="mb-4 rounded-2xl bg-green-500/15 border border-green-500/40 p-4 text-xs text-green-300">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <ThumbsUp className="h-4 w-4" /> Transfer Approved & Dispatched!
                      </div>
                      Reference: <span className="font-mono">{domSuccess.reference}</span>. Funds sent to {domSuccess.recipientOrSender}.
                    </div>
                  )}

                  {domError && (
                    <div className="mb-4 rounded-2xl bg-destructive/15 border border-destructive/40 p-4 text-xs text-destructive">
                      <AlertCircle className="h-4 w-4 inline mr-1" /> {domError}
                    </div>
                  )}

                  <form onSubmit={handleDomesticTransfer} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-foreground mb-1">Beneficiary Full Name *</label>
                      <input
                        type="text"
                        required
                        value={domForm.recipientName}
                        onChange={(e) => setDomForm({ ...domForm, recipientName: e.target.value })}
                        placeholder="e.g. Lumen Capital Partners"
                        className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Select Bank *</label>
                        <select
                          value={domForm.bankName}
                          onChange={(e) => setDomForm({ ...domForm, bankName: e.target.value })}
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5 text-foreground focus:border-primary focus:outline-none"
                        >
                          <option>JPMorgan Chase Bank, N.A.</option>
                          <option>Bank of America, N.A.</option>
                          <option>Citibank, N.A.</option>
                          <option>Wells Fargo Bank</option>
                          <option>Goldman Sachs Bank USA</option>
                          <option>Morgan Stanley Private Bank</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-1">Account / Routing Number *</label>
                        <input
                          type="text"
                          required
                          value={domForm.accountNumber}
                          onChange={(e) => setDomForm({ ...domForm, accountNumber: e.target.value })}
                          placeholder="e.g. 021000021-9988112"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-1">Recipient Bank Address *</label>
                      <input
                        type="text"
                        required
                        value={domForm.bankAddress}
                        onChange={(e) => setDomForm({ ...domForm, bankAddress: e.target.value })}
                        placeholder="e.g. 270 Park Ave, New York, NY 10017"
                        className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Transfer Amount (USD) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          required
                          value={domForm.amount}
                          onChange={(e) => setDomForm({ ...domForm, amount: e.target.value })}
                          placeholder="0.00"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 font-mono font-bold text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-1">Transaction PIN *</label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={domForm.pin}
                          onChange={(e) => setDomForm({ ...domForm, pin: e.target.value })}
                          placeholder="4-digit PIN"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 font-mono text-center tracking-widest text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-1">Payment Description / Memo</label>
                      <input
                        type="text"
                        value={domForm.description}
                        onChange={(e) => setDomForm({ ...domForm, description: e.target.value })}
                        placeholder="Invoice #9820 settlement"
                        className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isTransferringDom}
                      className={`${btnPrimary} w-full mt-2`}
                    >
                      {isTransferringDom ? "Authorizing Transfer..." : "Authorize Domestic Transfer"}
                    </button>
                  </form>
                </div>

                {/* 2. INTERNATIONAL TRANSFERS (STRICTLY EXCLUDING ALL AFRICAN COUNTRIES) */}
                <div className="glass rounded-[2rem] p-6 sm:p-8 border border-white/20 shadow-glass">
                  <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-5">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      <h3 className="font-bold text-base text-foreground">International Wire (Non-Africa)</h3>
                    </div>
                    <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold text-green-400 font-mono">
                      0% FX SPREAD
                    </span>
                  </div>

                  {intlSuccess && (
                    <div className="mb-4 rounded-2xl bg-green-500/15 border border-green-500/40 p-4 text-xs text-green-300">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <ThumbsUp className="h-4 w-4" /> SWIFT/RTGS Wire Approved!
                      </div>
                      Reference: <span className="font-mono">{intlSuccess.reference}</span>. Delivered to {intlSuccess.recipientOrSender}.
                    </div>
                  )}

                  {intlError && (
                    <div className="mb-4 rounded-2xl bg-destructive/15 border border-destructive/40 p-4 text-xs text-destructive">
                      <AlertCircle className="h-4 w-4 inline mr-1" /> {intlError}
                    </div>
                  )}

                  <form onSubmit={handleIntlTransfer} className="space-y-4 text-xs">
                    {/* Destination Country Selection - STRICTLY NON-AFRICAN */}
                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        Destination Country * (Eligible Non-African Corridors)
                      </label>
                      <select
                        value={intlForm.country}
                        onChange={(e) => {
                          const found = ELIGIBLE_INTERNATIONAL_COUNTRIES.find((c) => c.name === e.target.value);
                          setIntlForm({
                            ...intlForm,
                            country: e.target.value,
                            currency: found?.currency || "USD",
                            swiftBic: found?.swiftCode || "BANKXXXX",
                          });
                        }}
                        className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      >
                        {ELIGIBLE_INTERNATIONAL_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name} ({c.currency})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Beneficiary Name *</label>
                        <input
                          type="text"
                          required
                          value={intlForm.recipientName}
                          onChange={(e) => setIntlForm({ ...intlForm, recipientName: e.target.value })}
                          placeholder="e.g. Geneva Asset Management"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-1">Bank Name *</label>
                        <input
                          type="text"
                          required
                          value={intlForm.bankName}
                          onChange={(e) => setIntlForm({ ...intlForm, bankName: e.target.value })}
                          placeholder="e.g. Pictet & Cie"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">SWIFT / BIC Code *</label>
                        <input
                          type="text"
                          required
                          value={intlForm.swiftBic}
                          onChange={(e) => setIntlForm({ ...intlForm, swiftBic: e.target.value })}
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 font-mono uppercase text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-1">IBAN / Account Number *</label>
                        <input
                          type="text"
                          required
                          value={intlForm.iban}
                          onChange={(e) => setIntlForm({ ...intlForm, iban: e.target.value })}
                          placeholder="e.g. CH93 0089 3000..."
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 font-mono text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Amount & Real-Time FX Conversion Display */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block font-semibold text-foreground mb-1">Transfer Amount (USD) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          required
                          value={intlForm.amount}
                          onChange={(e) => setIntlForm({ ...intlForm, amount: e.target.value })}
                          placeholder="0.00"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 font-mono font-bold text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-1">Transaction PIN *</label>
                        <input
                          type="password"
                          maxLength={4}
                          required
                          value={intlForm.pin}
                          onChange={(e) => setIntlForm({ ...intlForm, pin: e.target.value })}
                          placeholder="4-digit PIN"
                          className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 font-mono text-center tracking-widest text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Live Conversion Preview */}
                    {intlForm.amount && Number(intlForm.amount) > 0 && (
                      <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3.5 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Exchange Rate:</span>
                          <span className="font-mono text-foreground font-semibold">
                            1 USD = {(EXCHANGE_RATES[intlForm.currency] || 1.0).toFixed(4)} {intlForm.currency}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transfer Fee:</span>
                          <span className="font-mono text-green-400 font-semibold">$0.00 (Waived)</span>
                        </div>
                        <div className="flex justify-between border-t border-border/40 pt-1.5 font-bold">
                          <span className="text-foreground">Beneficiary Receives:</span>
                          <span className="font-mono text-primary text-sm">
                            {(Number(intlForm.amount) * (EXCHANGE_RATES[intlForm.currency] || 1.0)).toFixed(2)} {intlForm.currency}
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isTransferringIntl}
                      className={`${btnPrimary} w-full mt-2`}
                    >
                      {isTransferringIntl ? "Clearing Wire..." : "Authorize International Wire"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: CURRENCY CONVERTER ================= */}
          {activeTab === "converter" && (
            <div className="animate-rise space-y-8 max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Institutional <span className="text-gradient">Currency Converter</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Access real-time wholesale interbank exchange rates with zero added spreads.
                </p>
              </div>

              <div className="glass rounded-[2.5rem] p-6 sm:p-10 border border-white/25 shadow-glass space-y-6">
                <div className="grid gap-4 sm:grid-cols-12 items-center">
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">You Convert</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={convAmount}
                        onChange={(e) => setConvAmount(Number(e.target.value))}
                        className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-3 font-mono text-lg font-bold text-foreground focus:border-primary focus:outline-none"
                      />
                      <select
                        value={convFrom}
                        onChange={(e) => setConvFrom(e.target.value)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-muted/60 px-3 py-1.5 text-xs font-bold font-mono text-foreground"
                      >
                        {Object.keys(EXCHANGE_RATES).map((curr) => (
                          <option key={curr} value={curr}>{curr}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        const temp = convFrom;
                        setConvFrom(convTo);
                        setConvTo(temp);
                      }}
                      className="grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-md"
                      title="Swap currencies"
                    >
                      <RefreshCw className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="sm:col-span-5">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">Converted Value</label>
                    <div className="relative">
                      <div className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-3 font-mono text-lg font-bold text-primary">
                        {convResult.converted.toFixed(2)}
                      </div>
                      <select
                        value={convTo}
                        onChange={(e) => setConvTo(e.target.value)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-muted/60 px-3 py-1.5 text-xs font-bold font-mono text-foreground"
                      >
                        {Object.keys(EXCHANGE_RATES).map((curr) => (
                          <option key={curr} value={curr}>{curr}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Rate Detail Summary Card */}
                <div className="rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-xl text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Mid-Market Rate:</span>
                    <span className="font-mono text-foreground font-semibold">
                      1 {convFrom} = {convResult.rate.toFixed(4)} {convTo}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Varenta Conversion Fee:</span>
                    <span className="font-mono text-green-400 font-semibold">$0.00 (0% Markup)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Market Comparison:</span>
                    <span className="text-muted-foreground">
                      Traditional banks charge 3.5%–4.0% (~${(convAmount * 0.038).toFixed(2)} USD fee)
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/40 pt-2 text-[10px] text-muted-foreground">
                    <span>Live Institutional Feed</span>
                    <span>Updated: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: BILL PAYMENTS ================= */}
          {activeTab === "bills" && (
            <div className="animate-rise space-y-8 max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Utility & Bill <span className="text-gradient">Payments</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Pay electricity, water, internet, cable TV, airtime, and data bundles with instant digital receipts.
                </p>
              </div>

              {billReceipt && (
                <div className="rounded-3xl bg-green-500/15 border border-green-500/40 p-6 text-xs text-green-300">
                  <div className="flex items-center gap-2 font-bold text-sm mb-2">
                    <CheckCircle2 className="h-5 w-5" /> Bill Payment Successful!
                  </div>
                  <p>Receipt Number: <span className="font-mono font-bold">{billReceipt}</span></p>
                  <p className="mt-1">Category: {billCategory} • Provider: {billProvider}</p>
                </div>
              )}

              {billError && (
                <div className="rounded-3xl bg-destructive/15 border border-destructive/40 p-4 text-xs text-destructive">
                  <AlertCircle className="h-4 w-4 inline mr-1" /> {billError}
                </div>
              )}

              <div className="glass rounded-[2.5rem] p-6 sm:p-10 border border-white/25 shadow-glass">
                {/* Category Selector Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {(Object.keys(BILL_PROVIDERS) as Array<keyof typeof BILL_PROVIDERS>).map((cat) => {
                    const isSelected = billCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setBillCategory(cat);
                          setBillProvider(BILL_PROVIDERS[cat]?.[0]?.name ?? "");
                        }}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-glow scale-105"
                            : "border border-border/60 bg-background/60 hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleBillPayment} className="space-y-5 text-xs">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block font-semibold text-foreground mb-1">Select Provider *</label>
                      <select
                        value={billProvider}
                        onChange={(e) => setBillProvider(e.target.value)}
                        className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-foreground focus:border-primary focus:outline-none"
                      >
                        {BILL_PROVIDERS[billCategory].map((p) => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        Customer / Meter / Account Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={billAccount}
                        onChange={(e) => setBillAccount(e.target.value)}
                        placeholder="e.g. 9820-4109-22"
                        className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">Payment Amount (USD) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 font-mono font-bold text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPayingBill}
                    className={`${btnPrimary} w-full mt-4`}
                  >
                    {isPayingBill ? "Processing Payment..." : `Pay Bill to ${billProvider}`}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB 5: CARDS MANAGEMENT ================= */}
          {activeTab === "cards" && (
            <div className="animate-rise space-y-8 max-w-4xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Virtual & Metal <span className="text-gradient">Card Controls</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage limits, dynamic CVV settings, international usage, and instant card freezing.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="glass rounded-[2rem] p-6 border border-white/20 shadow-glass space-y-4">
                  <h3 className="font-bold text-base text-foreground">Spending & ATM Limits</h3>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Daily Transaction Limit</span>
                      <span className="font-mono font-bold text-primary">${card.dailyLimit.toLocaleString()} USD</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={card.dailyLimit}
                      onChange={(e) => updateCardLimit(Number(e.target.value))}
                      className="w-full accent-primary cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-border/40 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Contactless NFC Payments</p>
                        <p className="text-muted-foreground text-[11px]">Pay anywhere with Apple Pay & Google Wallet</p>
                      </div>
                      <span className="rounded-full bg-green-500/20 text-green-400 font-bold px-2 py-0.5 text-[10px]">
                        ENABLED
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">International Borderless Spend</p>
                        <p className="text-muted-foreground text-[11px]">Valid across 21 operating hubs with 0% FX fees</p>
                      </div>
                      <span className="rounded-full bg-green-500/20 text-green-400 font-bold px-2 py-0.5 text-[10px]">
                        ACTIVE
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-[2rem] p-6 border border-white/20 shadow-glass space-y-4">
                  <h3 className="font-bold text-base text-foreground">Security & 360° Dynamic Protection</h3>
                  <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-xs">
                    <p className="font-semibold text-foreground flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="h-4 w-4 text-primary" /> Rolling Dynamic CVV Active
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      Your CVV rotates every 30 minutes in the mobile app to ensure no merchant compromise can compromise your account.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={toggleCardFreeze}
                    className={`w-full py-3 rounded-2xl font-semibold text-xs transition-all ${
                      card.isFrozen
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "border border-destructive/50 bg-destructive/15 text-destructive hover:bg-destructive/25"
                    }`}
                  >
                    {card.isFrozen ? "Unfreeze World Elite Card" : "Emergency Freeze Card"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 6: TRANSACTIONS & STATEMENTS ================= */}
          {activeTab === "transactions" && (
            <div className="animate-rise space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Transaction History & <span className="text-gradient">Statements</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Official ledger records for audits, taxes, and personal records.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={downloadStatement}
                  className={`${btnPrimary} py-2 text-xs`}
                >
                  <Download className="h-3.5 w-3.5" /> Download Official Statement
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={txnSearch}
                    onChange={(e) => setTxnSearch(e.target.value)}
                    placeholder="Search by recipient, description, or TXN ID..."
                    className="w-full rounded-2xl border border-border/60 bg-background/70 pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <select
                  value={txnTypeFilter}
                  onChange={(e) => setTxnTypeFilter(e.target.value)}
                  className="rounded-2xl border border-border/60 bg-background/70 px-4 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Domestic Transfer">Domestic Transfer</option>
                  <option value="International Wire">International Wire</option>
                  <option value="Bill Payment">Bill Payment</option>
                  <option value="Deposit">Deposit</option>
                </select>
              </div>

              {/* Transactions Glass Table */}
              <div className="overflow-x-auto rounded-[2rem] border border-white/20 bg-background/60 shadow-glass">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground">
                      <th className="py-3.5 px-5 font-semibold">Transaction ID</th>
                      <th className="py-3.5 px-5 font-semibold">Date & Time</th>
                      <th className="py-3.5 px-5 font-semibold">Type</th>
                      <th className="py-3.5 px-5 font-semibold">Counterparty / Description</th>
                      <th className="py-3.5 px-5 font-semibold">Amount</th>
                      <th className="py-3.5 px-5 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-5 font-mono font-semibold text-primary">{t.id}</td>
                        <td className="py-3.5 px-5 text-muted-foreground whitespace-nowrap">{t.date}</td>
                        <td className="py-3.5 px-5 font-medium text-foreground">{t.type}</td>
                        <td className="py-3.5 px-5">
                          <p className="font-semibold text-foreground">{t.recipientOrSender}</p>
                          <span className="text-[10px] text-muted-foreground">{t.description}</span>
                        </td>
                        <td
                          className={`py-3.5 px-5 font-mono font-bold whitespace-nowrap ${
                            t.amount > 0 ? "text-green-400" : "text-foreground"
                          }`}
                        >
                          {t.amount > 0 ? "+" : ""}{formatMoney(t.amount, t.currency)}
                        </td>
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-[10px] font-bold text-green-400">
                            <ThumbsUp className="h-3 w-3" /> {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= TAB 7: BENEFICIARIES ================= */}
          {activeTab === "beneficiaries" && (
            <div className="animate-rise space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Saved <span className="text-gradient">Beneficiaries</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Pre-verified domestic and international payees for rapid wire execution.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddBen(!showAddBen)}
                  className={`${btnPrimary} py-2 text-xs`}
                >
                  <Plus className="h-4 w-4" /> Add Beneficiary
                </button>
              </div>

              {showAddBen && (
                <div className="glass rounded-[2rem] p-6 border border-white/20 shadow-glass">
                  <h3 className="font-bold text-sm text-foreground mb-4">Add New Pre-Verified Payee</h3>
                  <div className="grid gap-3 sm:grid-cols-2 text-xs">
                    <input
                      type="text"
                      placeholder="Beneficiary Full Name"
                      value={newBen.name}
                      onChange={(e) => setNewBen({ ...newBen, name: e.target.value })}
                      className="rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Bank Name"
                      value={newBen.bankName}
                      onChange={(e) => setNewBen({ ...newBen, bankName: e.target.value })}
                      className="rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Account Number or IBAN"
                      value={newBen.accountNumber}
                      onChange={(e) => setNewBen({ ...newBen, accountNumber: e.target.value })}
                      className="rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-foreground"
                    />
                    <input
                      type="text"
                      placeholder="SWIFT / BIC Code (if international)"
                      value={newBen.swiftBic}
                      onChange={(e) => setNewBen({ ...newBen, swiftBic: e.target.value })}
                      className="rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-foreground font-mono"
                    />
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddBen(false)}
                      className="rounded-full border border-border/60 px-4 py-1.5 text-xs text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newBen.name || !newBen.accountNumber) return;
                        addBeneficiary(newBen);
                        setShowAddBen(false);
                      }}
                      className={btnPrimary}
                    >
                      Save Beneficiary
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                {beneficiaries.map((b) => (
                  <div
                    key={b.id}
                    className="glass rounded-3xl p-5 border border-white/20 shadow-glass flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">
                          {b.type.toUpperCase()}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeBeneficiary(b.id)}
                          className="text-muted-foreground hover:text-destructive"
                          title="Remove Beneficiary"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <h4 className="font-bold text-sm text-foreground">{b.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{b.bankName}</p>
                      <p className="font-mono text-xs text-foreground/80 mt-2 truncate">
                        {maskString(b.accountNumber, 4)}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center justify-between">
                      <span>{b.country}</span>
                      <span className="font-mono font-bold text-primary">{b.currency}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 8: CLIENT PROFILE & SETTINGS ================= */}
          {activeTab === "profile" && (
            <div className="animate-rise space-y-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Client <span className="text-gradient">Profile & Security</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manage verified credentials, notification settings, and biometric authorization.
                  </p>
                </div>
              </div>

              {profileSavedMsg && (
                <div className="rounded-2xl bg-green-500/15 border border-green-500/40 p-4 text-xs text-green-300">
                  <CheckCircle2 className="h-4 w-4 inline mr-1" /> {profileSavedMsg}
                </div>
              )}

              {/* Profile Card Header */}
              <div className="glass rounded-[2.5rem] p-6 sm:p-8 border border-white/25 shadow-glass flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.firstName}
                      className="h-24 w-24 rounded-full object-cover border-2 border-primary shadow-glow"
                    />
                  ) : (
                    <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-primary text-3xl font-bold text-primary-foreground shadow-glow">
                      {user.firstName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <h3 className="text-xl font-bold text-foreground">
                      {user.firstName} {user.middleName} {user.lastName}
                    </h3>
                    <span className="rounded-full bg-green-500/15 border border-green-500/30 px-2.5 py-0.5 text-[10px] font-bold text-green-400">
                      {user.status}
                    </span>
                    <span className="rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      {user.tier}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">{user.occupation}</p>
                  <p className="text-xs font-mono text-muted-foreground mt-2">
                    Account: {maskString(user.accountNumber, 4)} • Type: {user.accountType}
                  </p>
                </div>
              </div>

              {/* Editable Information Grid */}
              <div className="glass rounded-[2.5rem] p-6 sm:p-8 border border-white/25 shadow-glass space-y-6">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <h4 className="font-bold text-sm text-foreground">Personal & Contact Coordinates</h4>
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditingProfile) {
                        updateProfile(profileForm);
                        setProfileSavedMsg("Verified profile changes saved successfully.");
                        setTimeout(() => setProfileSavedMsg(""), 3000);
                      }
                      setIsEditingProfile(!isEditingProfile);
                    }}
                    className={`${btnPrimary} py-1.5 px-4 text-xs`}
                  >
                    {isEditingProfile ? "Save Changes" : "Edit Profile"}
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-xs">
                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled={!isEditingProfile}
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 text-foreground disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Mobile Phone</label>
                    <input
                      type="tel"
                      disabled={!isEditingProfile}
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 text-foreground disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Residential Address</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 text-foreground disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label className="text-muted-foreground font-semibold block mb-1">Occupation</label>
                    <input
                      type="text"
                      disabled={!isEditingProfile}
                      value={profileForm.occupation}
                      onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                      className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 text-foreground disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION DOCK ================= */}
      <nav className="lg:hidden sticky bottom-0 z-40 border-t border-white/10 bg-background/90 backdrop-blur-2xl px-2 py-2">
        <div className="flex items-center justify-around">
          {[
            { id: "overview", label: "Home", icon: Wallet },
            { id: "transfers", label: "Transfer", icon: Send },
            { id: "bills", label: "Bills", icon: Receipt },
            { id: "cards", label: "Card", icon: CreditCard },
            { id: "profile", label: "Profile", icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex flex-col items-center gap-1 rounded-2xl p-2 text-[10px] font-semibold transition-all ${
                  isActive ? "text-primary scale-110" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ================= MODAL: DEPOSIT FUNDS ================= */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-rise">
          <div className="relative w-full max-w-md rounded-[2.5rem] border border-white/20 bg-background/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-base text-foreground">Deposit Capital</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="rounded-full p-1 text-muted-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-foreground mb-1">Target Account</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Current Account", "Savings Account"].map((acc) => (
                    <button
                      key={acc}
                      type="button"
                      onClick={() => setDepositTarget(acc as any)}
                      className={`rounded-2xl border p-2.5 text-center font-semibold transition-all ${
                        depositTarget === acc
                          ? "border-primary bg-primary/20 text-foreground ring-1 ring-primary"
                          : "border-border/60 bg-muted/20 text-muted-foreground"
                      }`}
                    >
                      {acc}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Funding Rail / Method</label>
                <select
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value)}
                  className="w-full rounded-2xl border border-border/60 bg-background/70 px-3 py-2.5 text-foreground focus:border-primary focus:outline-none"
                >
                  <option>Federal Reserve Wire (Fedwire / RTGS)</option>
                  <option>SEPA Instant Cross-Border Clearing</option>
                  <option>ACH Same-Day Bank Settlement</option>
                  <option>Debit / Credit Card (Instant Credit)</option>
                  <option>Institutional Treasury Sweep</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-foreground mb-1">Deposit Amount (USD) *</label>
                <input
                  type="number"
                  min="10"
                  step="100"
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full rounded-2xl border border-border/60 bg-background/70 px-4 py-2.5 font-mono text-lg font-bold text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="rounded-2xl border border-white/20 bg-muted/30 p-3 text-[11px] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-400 shrink-0" />
                <span>FDIC Swept Custody. Zero deposit fees. Instant clearing.</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 rounded-full border border-border/60 py-2.5 text-xs text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingDeposit}
                  className={`${btnPrimary} flex-1`}
                >
                  {isProcessingDeposit ? "Executing Deposit..." : `Deposit $${depositAmount.toLocaleString()}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
