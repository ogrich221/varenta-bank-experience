import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Wallet, Users, ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle,
  ThumbsUp, PlusCircle, MinusCircle, Calendar, RefreshCcw, Trash2, AlertTriangle,
  FileText, ShieldCheck, DollarSign, Search, Check, X, Edit3, Eye, Camera, ExternalLink,
  UserPlus, Landmark
} from "lucide-react";
import { toast } from "sonner";
import { useBanking, formatCurrency } from "@/lib/banking-context";
import { ManagedUser, UserProfile } from "@/lib/banking-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [{ title: "Central Treasury Command — Varenta Admin" }],
  }),
  component: AdminCommandCenter,
});

function AdminCommandCenter() {
  const navigate = useNavigate();
  const {
    managedUsers,
    clearAllUsers,
    switchActiveUser,
    adminCreditUser,
    adminDebitUser,
    adminUpdateUserProfile,
    adminCreateUser,
    adminApproveTransaction,
    adminDeclineTransaction,
    transactions,
    totalBalance,
  } = useBanking();

  // Create User Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    country: "United States",
    nationality: "American",
    occupation: "Executive",
    dob: "1990-01-01",
    gender: "Prefer not to say",
    preferredCurrency: "USD",
    accountType: "Current Account" as "Current Account" | "Savings Account",
    tier: "World Elite" as "World Elite" | "Platinum" | "Private Client",
    status: "Active" as "Active" | "Verified" | "Pending KYC" | "Suspended",
    approvalStatus: "Approved" as "Approved" | "Pending Approval" | "Declined" | "Suspended",
    initialCheckingBalance: "0.00",
    initialSavingsBalance: "0.00",
    openingNarration: "Initial Treasury Allocation — Account Opening",
    profilePic: "",
  });

  // Credit / Debit Terminal State
  const [selectedUserId, setSelectedUserId] = useState<string>(managedUsers[0]?.id || "");
  const [actionType, setActionType] = useState<"credit" | "debit">("credit");
  const [accountType, setAccountType] = useState<"Current Account" | "Savings Account">("Current Account");
  const [amountStr, setAmountStr] = useState<string>("");
  const [narration, setNarration] = useState<string>("");
  const [customDate, setCustomDate] = useState<string>(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Edit Profile Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [profileForm, setProfileForm] = useState<Partial<UserProfile>>({});
  const [approvalStatusForm, setApprovalStatusForm] = useState<"Approved" | "Pending Approval" | "Declined" | "Suspended">("Approved");

  // Clear Users Dialog State
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  // Approval filter
  const [approvalTab, setApprovalTab] = useState<"pending" | "approved" | "declined" | "all">("pending");
  const [searchTxn, setSearchTxn] = useState("");

  // Computed metrics
  const totalClients = managedUsers.length;
  const pendingTxns = useMemo(
    () => transactions.filter((t) => t.status === "Pending"),
    [transactions]
  );
  const approvedTxns = useMemo(
    () => transactions.filter((t) => t.status === "Successful"),
    [transactions]
  );
  const declinedTxns = useMemo(
    () => transactions.filter((t) => t.status === "Failed" || t.status === "Reversed"),
    [transactions]
  );

  const filteredTxns = useMemo(() => {
    return transactions.filter((t) => {
      if (approvalTab === "pending" && t.status !== "Pending") return false;
      if (approvalTab === "approved" && t.status !== "Successful") return false;
      if (approvalTab === "declined" && t.status !== "Failed" && t.status !== "Reversed") return false;
      if (searchTxn.trim()) {
        const q = searchTxn.toLowerCase();
        return (
          t.description.toLowerCase().includes(q) ||
          t.recipientOrSender.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.amount.toString().includes(q)
        );
      }
      return true;
    });
  }, [transactions, approvalTab, searchTxn]);

  // Handle Create User
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.firstName.trim() || !createForm.lastName.trim()) {
      toast.error("First Name and Last Name are required");
      return;
    }
    if (!createForm.email.trim()) {
      toast.error("Valid Email Address is required");
      return;
    }

    try {
      const newUser = adminCreateUser({
        firstName: createForm.firstName.trim(),
        middleName: createForm.middleName.trim(),
        lastName: createForm.lastName.trim(),
        email: createForm.email.trim(),
        phone: createForm.phone.trim() || "+1 (555) 019-2834",
        address: createForm.address.trim() || "1 Wall Street, Financial District",
        country: createForm.country,
        nationality: createForm.nationality,
        occupation: createForm.occupation,
        dob: createForm.dob,
        gender: createForm.gender,
        preferredCurrency: createForm.preferredCurrency,
        accountType: createForm.accountType,
        tier: createForm.tier,
        status: createForm.status,
        approvalStatus: createForm.approvalStatus,
        initialCheckingBalance: parseFloat(createForm.initialCheckingBalance) || 0,
        initialSavingsBalance: parseFloat(createForm.initialSavingsBalance) || 0,
        openingNarration: createForm.openingNarration.trim(),
        profilePic: createForm.profilePic.trim(),
      });

      toast.success(`Client ${newUser.profile.firstName} ${newUser.profile.lastName} created! Account #${newUser.accounts[0].accountNumber}`);
      setSelectedUserId(newUser.id);
      setCreateModalOpen(false);

      // Reset form
      setCreateForm({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        country: "United States",
        nationality: "American",
        occupation: "Executive",
        dob: "1990-01-01",
        gender: "Prefer not to say",
        preferredCurrency: "USD",
        accountType: "Current Account",
        tier: "World Elite",
        status: "Active",
        approvalStatus: "Approved",
        initialCheckingBalance: "0.00",
        initialSavingsBalance: "0.00",
        openingNarration: "Initial Treasury Allocation — Account Opening",
        profilePic: "",
      });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create client");
    }
  };

  // Handle Credit / Debit Submission
  const handleExecuteLedger = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amountStr);
    if (isNaN(num) || num <= 0) {
      toast.error("Please enter a valid amount greater than $0.00");
      return;
    }
    if (!selectedUserId) {
      toast.error("Please select a target customer");
      return;
    }
    if (!narration.trim()) {
      toast.error("Please input a transaction narration or memo");
      return;
    }

    setIsProcessing(true);
    try {
      const parsedDate = customDate ? new Date(customDate).toISOString().replace("T", " ").substring(0, 16) : new Date().toISOString();
      if (actionType === "credit") {
        adminCreditUser({
          userId: selectedUserId,
          amount: num,
          accountType,
          narration: narration.trim(),
          date: parsedDate,
        });
        toast.success(`Successfully credited ${formatCurrency(num)} to customer`);
      } else {
        adminDebitUser({
          userId: selectedUserId,
          amount: num,
          accountType,
          narration: narration.trim(),
          date: parsedDate,
        });
        toast.success(`Successfully debited ${formatCurrency(num)} from customer`);
      }
      setAmountStr("");
      setNarration("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to execute transaction");
    } finally {
      setIsProcessing(false);
    }
  };

  // Open Edit Profile Modal
  const handleOpenEdit = (user: ManagedUser) => {
    setEditingUser(user);
    setProfileForm({
      firstName: user.profile.firstName,
      middleName: user.profile.middleName || "",
      lastName: user.profile.lastName,
      email: user.profile.email,
      phone: user.profile.phone,
      address: user.profile.address,
      country: user.profile.country,
      nationality: user.profile.nationality,
      occupation: user.profile.occupation,
      dob: user.profile.dob,
      gender: user.profile.gender,
      status: user.profile.status,
      tier: user.profile.tier,
      preferredCurrency: user.profile.preferredCurrency,
      profilePic: user.profile.profilePic || user.kycSelfie || "",
    });
    setApprovalStatusForm(user.approvalStatus);
    setEditModalOpen(true);
  };

  // Save Profile Changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!profileForm.firstName?.trim() || !profileForm.lastName?.trim()) {
      toast.error("First and Last name are required");
      return;
    }

    try {
      adminUpdateUserProfile(editingUser.id, profileForm, approvalStatusForm);
      toast.success(`Profile for ${profileForm.firstName} ${profileForm.lastName} updated successfully`);
      setEditModalOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    }
  };

  // Switch to Client View
  const handleViewAsClient = (userId: string) => {
    switchActiveUser(userId);
    toast.success("Switched active user session to selected client");
    navigate({ to: "/dashboard" });
  };

  // Handle Clear All Users
  const handleClearAll = () => {
    if (confirmText.trim().toUpperCase() !== "CLEAR ALL") {
      toast.error('Please type "CLEAR ALL" to confirm');
      return;
    }
    clearAllUsers();
    setClearModalOpen(false);
    setConfirmText("");
    setSelectedUserId("");
    toast.success("All users cleared and reset to initial state");
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
            Treasury <span className="text-orange-500">Command Center</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Real-time control over liquidity, user credit/debits, profile editing, and transaction approvals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-4 py-2 text-xs font-bold text-black hover:brightness-110 shadow-[0_0_20px_rgba(249,115,22,0.35)] transition-all cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create New Client</span>
          </button>

          <Link
            to="/admin/customers"
            className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <Users className="h-4 w-4 text-orange-400" />
            <span>Customer Directory</span>
          </Link>

          <button
            onClick={() => setClearModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 hover:border-rose-500 transition-all shadow-[0_0_15px_rgba(244,63,94,0.1)]"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All Users</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-orange-500/20 bg-black/60 p-5 backdrop-blur-xl shadow-[0_0_25px_rgba(249,115,22,0.06)]">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase font-mono tracking-wider">Total Managed Balance</span>
            <Wallet className="h-5 w-5 text-orange-400" />
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-display font-black text-white">
            {formatCurrency(totalBalance)}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Sum across checking & savings</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase font-mono tracking-wider">Registered Clients</span>
            <Users className="h-5 w-5 text-amber-400" />
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-display font-black text-white">
            {totalClients}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Active customer bank accounts</p>
        </div>

        <div className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-5 backdrop-blur-xl shadow-[0_0_20px_rgba(249,115,22,0.15)]">
          <div className="flex items-center justify-between text-orange-400">
            <span className="text-xs uppercase font-mono tracking-wider">Pending Approvals</span>
            <Clock className="h-5 w-5 text-orange-400 animate-pulse" />
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-display font-black text-orange-400">
            {pendingTxns.length}
          </p>
          <p className="text-[11px] text-orange-300/80 mt-1">Awaiting admin review</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-black/60 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs uppercase font-mono tracking-wider">Approved & Settled</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          </div>
          <p className="mt-3 text-2xl sm:text-3xl font-display font-black text-emerald-400">
            {approvedTxns.length}
          </p>
          <p className="text-[11px] text-zinc-500 mt-1">Verified with bank thumbs up</p>
        </div>
      </div>

      {/* Institutional Solvency & Global Jurisdictions Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl text-xs font-mono">
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>100% Full-Reserve Tier-1 Custody</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-orange-400" />
          <span>$18.4B+ Institutional Liquidity</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>21 Operating Clearing Hubs</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span>FDIC Swept ($2.5M / Client)</span>
        </div>
      </div>

      {/* Main Grid: Credit/Debit Terminal on Left, Transaction Approvals on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Credit & Debit Terminal */}
        <div className="xl:col-span-5 space-y-6">
          <div className="rounded-3xl border border-orange-500/30 bg-black/75 p-6 backdrop-blur-2xl shadow-[0_0_40px_rgba(249,115,22,0.08)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <DollarSign className="h-4 w-4" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-white">Credit / Debit Terminal</h2>
                  <p className="text-[11px] text-zinc-400">Post custom ledger entries with custom dates</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono text-emerald-400">
                AUTHORITY ACTIVE
              </span>
            </div>

            <form onSubmit={handleExecuteLedger} className="mt-5 space-y-4">
              {/* Select Target Customer */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Target Customer
                </label>
                {managedUsers.length === 0 ? (
                  <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                    No customers found. Create an account via Open Account first.
                  </p>
                ) : (
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  >
                    {managedUsers.map((u) => {
                      const fullName = `${u.profile.firstName} ${u.profile.lastName}`;
                      const total = u.accounts.reduce((s, a) => s + a.balance, 0);
                      return (
                        <option key={u.id} value={u.id} className="bg-zinc-900 text-white">
                          {fullName} — {u.profile.email} ({formatCurrency(total)})
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>

              {/* Action Type: Credit or Debit */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setActionType("credit")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold border transition-all ${
                    actionType === "credit"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Credit User (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActionType("debit")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold border transition-all ${
                    actionType === "debit"
                      ? "bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:text-white"
                  }`}
                >
                  <MinusCircle className="h-4 w-4" />
                  <span>Debit User (-)</span>
                </button>
              </div>

              {/* Account selection: Checking vs Savings */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Target Account
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAccountType("Current Account")}
                    className={`rounded-xl py-2 px-3 text-xs font-semibold border transition-all ${
                      accountType === "Current Account"
                        ? "bg-orange-500/20 border-orange-500 text-orange-400"
                        : "bg-white/5 border-white/10 text-zinc-400"
                    }`}
                  >
                    Current Checking
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("Savings Account")}
                    className={`rounded-xl py-2 px-3 text-xs font-semibold border transition-all ${
                      accountType === "Savings Account"
                        ? "bg-orange-500/20 border-orange-500 text-orange-400"
                        : "bg-white/5 border-white/10 text-zinc-400"
                    }`}
                  >
                    High-Yield Vault (5.15% APY)
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Amount (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 font-bold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/15 bg-white/5 pl-8 pr-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Custom Date & Time Selection */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
                  <Calendar className="h-3.5 w-3.5 text-orange-400" />
                  <span>Choose Transaction Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 [color-scheme:dark]"
                />
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  You can set any custom past or future date for this record.
                </span>
              </div>

              {/* Narration */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1.5">
                  <FileText className="h-3.5 w-3.5 text-orange-400" />
                  <span>Transaction Narration / Memo</span>
                </label>
                <input
                  type="text"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="e.g. Treasury Liquidity Allocation / Bonus Credit"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              {/* Submit Execution */}
              <button
                type="submit"
                disabled={isProcessing || managedUsers.length === 0}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 py-3 text-xs font-bold text-black shadow-[0_0_25px_rgba(249,115,22,0.3)] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>
                  {actionType === "credit" ? "Execute Credit to Customer" : "Execute Debit from Customer"}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Transaction Approvals & Declines Desk */}
        <div className="xl:col-span-7 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-black/75 p-6 backdrop-blur-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Transaction Approvals & Declines</span>
                  {pendingTxns.length > 0 && (
                    <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-black">
                      {pendingTxns.length} PENDING
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Admin decides whether transactions succeed with bank thumbs up or get declined
                </p>
              </div>

              {/* Tab Filters */}
              <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 border border-white/10">
                <button
                  onClick={() => setApprovalTab("pending")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    approvalTab === "pending"
                      ? "bg-orange-500 text-black shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Pending ({pendingTxns.length})
                </button>
                <button
                  onClick={() => setApprovalTab("approved")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    approvalTab === "approved"
                      ? "bg-emerald-500 text-black shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setApprovalTab("declined")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    approvalTab === "declined"
                      ? "bg-rose-500 text-black shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Declined
                </button>
                <button
                  onClick={() => setApprovalTab("all")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    approvalTab === "all"
                      ? "bg-white/20 text-white shadow"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  All
                </button>
              </div>
            </div>

            {/* Search filter for transactions */}
            <div className="relative mt-4 mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                value={searchTxn}
                onChange={(e) => setSearchTxn(e.target.value)}
                placeholder="Filter by description, recipient, reference ID..."
                className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-orange-500"
              />
            </div>

            {/* Transaction List */}
            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredTxns.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-zinc-600" />
                  <p className="mt-2 text-sm text-zinc-400 font-medium">
                    No transactions in this queue
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    Transactions initiated by users or admin will appear here for review.
                  </p>
                </div>
              ) : (
                filteredTxns.map((t) => {
                  const isPending = t.status === "Pending";
                  const isApproved = t.status === "Successful";
                  const isDeclined = t.status === "Failed" || t.status === "Reversed";

                  return (
                    <div
                      key={t.id}
                      className={`rounded-2xl border p-4 transition-all ${
                        isPending
                          ? "border-orange-500/40 bg-orange-500/5 hover:border-orange-500"
                          : isApproved
                          ? "border-emerald-500/20 bg-emerald-500/5"
                          : "border-rose-500/20 bg-rose-500/5"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-zinc-500">
                              {t.id}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                              {t.type}
                            </span>

                            {isApproved && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                                <ThumbsUp className="h-3 w-3" />
                                <span>Approved 👍</span>
                              </span>
                            )}

                            {isDeclined && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                                <XCircle className="h-3 w-3" />
                                <span>Declined / Reversed</span>
                              </span>
                            )}

                            {isPending && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/20 border border-orange-500/40 px-2 py-0.5 text-[10px] font-bold text-orange-400 animate-pulse">
                                <Clock className="h-3 w-3" />
                                <span>Pending Approval</span>
                              </span>
                            )}
                          </div>

                          <p className="text-sm font-bold text-white">{t.description}</p>
                          <p className="text-xs text-zinc-400">
                            Recipient / Counterparty:{" "}
                            <span className="text-zinc-200">{t.recipientOrSender}</span>
                          </p>
                          {t.recipientBank && (
                            <p className="text-xs text-orange-400 font-mono">
                              Bank: {t.recipientBank}
                            </p>
                          )}
                          <p className="text-[10px] text-zinc-500">
                            Logged Date: {new Date(t.date).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                          <span
                            className={`text-base font-black font-display ${
                              t.type === "Deposit" || t.type === "Admin Credit" || t.amount > 0
                                ? "text-emerald-400"
                                : "text-white"
                            }`}
                          >
                            {t.amount > 0 ? "+" : ""}
                            {formatCurrency(t.amount, t.currency)}
                          </span>

                          {/* Approval Actions */}
                          {isPending && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => {
                                  adminApproveTransaction(t.id);
                                  toast.success(
                                    `Transaction ${t.id} approved with bank thumbs up 👍`
                                  );
                                }}
                                className="flex items-center gap-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 text-xs font-bold text-black transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => {
                                  adminDeclineTransaction(t.id);
                                  toast.error(
                                    `Transaction ${t.id} declined & refunded to user`
                                  );
                                }}
                                className="flex items-center gap-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 px-3 py-1.5 text-xs font-bold text-rose-400 transition-all"
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>Decline</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Directory Ledger */}
      <div className="rounded-3xl border border-white/10 bg-black/75 p-6 backdrop-blur-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">Live Customer Directory</h2>
            <p className="text-[11px] text-zinc-400">
              Direct access to edit profiles, adjust account balances, or view personal dashboard.
            </p>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Total active clients: <span className="text-orange-400 font-bold">{managedUsers.length}</span>
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          {managedUsers.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto h-8 w-8 text-zinc-600" />
              <p className="mt-2 text-sm text-zinc-400">No active users in database</p>
              <Link
                to="/open-account"
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-black"
              >
                Register First Customer
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 font-mono text-[11px]">
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Account Number</th>
                  <th className="py-3 px-3">Checking Balance</th>
                  <th className="py-3 px-3">Savings Balance</th>
                  <th className="py-3 px-3">Total Balance</th>
                  <th className="py-3 px-3">KYC Status</th>
                  <th className="py-3 px-3 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {managedUsers.map((u) => {
                  const fullName = `${u.profile.firstName} ${u.profile.lastName}`;
                  const checking = u.accounts.find((a) => a.type === "Current Account")?.balance ?? 0;
                  const savings = u.accounts.find((a) => a.type === "Savings Account")?.balance ?? 0;
                  const total = u.accounts.reduce((s, a) => s + a.balance, 0);
                  const avatar = u.profile.profilePic || u.kycSelfie;
                  const accNum = u.accounts[0]?.accountNumber || u.profile.accountNumber;

                  return (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={fullName}
                              className="h-8 w-8 rounded-full object-cover border border-orange-500/30"
                            />
                          ) : (
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                              {u.profile.firstName[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white">{fullName}</p>
                            <p className="text-[11px] text-zinc-400">{u.profile.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-zinc-300">
                        {accNum}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {formatCurrency(checking, u.profile.preferredCurrency)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {formatCurrency(savings, u.profile.preferredCurrency)}
                      </td>
                      <td className="py-3 px-3 font-bold text-orange-400">
                        {formatCurrency(total, u.profile.preferredCurrency)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          <ShieldCheck className="h-3 w-3" />
                          <span>{u.profile.status}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Edit Profile */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="rounded-lg bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 text-[11px] font-semibold text-orange-400 hover:bg-orange-500/20"
                            title="Edit Profile"
                          >
                            <Edit3 className="h-3 w-3 inline mr-1" />
                            Edit Profile
                          </button>

                          {/* Quick Adjust */}
                          <button
                            onClick={() => {
                              setSelectedUserId(u.id);
                              window.scrollTo({ top: 120, behavior: "smooth" });
                              toast.info(`Selected ${fullName} in Credit/Debit Terminal above`);
                            }}
                            className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:bg-white/10"
                            title="Adjust Balance"
                          >
                            Adjust Balance
                          </button>

                          {/* View as Client */}
                          <button
                            onClick={() => handleViewAsClient(u.id)}
                            className="rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-[11px] font-semibold text-zinc-400 hover:text-white"
                            title="View as Client"
                          >
                            <Eye className="h-3 w-3 inline" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE NEW CLIENT MODAL */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="border border-orange-500/30 bg-zinc-950 text-white backdrop-blur-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white text-lg font-bold">
              <UserPlus className="h-5 w-5 text-orange-400" />
              <span>Create & Provision New Bank Client</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Directly issue checking and savings accounts, allocate opening ledger balances, issue a virtual debit card, and establish banking status.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClient} className="space-y-4 mt-2 text-xs">
            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={createForm.firstName}
                  onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                  placeholder="e.g. Alexander"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Middle Name</label>
                <input
                  type="text"
                  value={createForm.middleName}
                  onChange={(e) => setCreateForm({ ...createForm, middleName: e.target.value })}
                  placeholder="e.g. Vance"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={createForm.lastName}
                  onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                  placeholder="e.g. Sterling"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="client@varenta.com"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  placeholder="+1 (555) 019-2834"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Residential address & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={createForm.address}
                  onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                  placeholder="742 Evergreen Terrace"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Country of Residence</label>
                <input
                  type="text"
                  value={createForm.country}
                  onChange={(e) => setCreateForm({ ...createForm, country: e.target.value })}
                  placeholder="United States"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Nationality</label>
                <input
                  type="text"
                  value={createForm.nationality}
                  onChange={(e) => setCreateForm({ ...createForm, nationality: e.target.value })}
                  placeholder="American"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Occupation</label>
                <input
                  type="text"
                  value={createForm.occupation}
                  onChange={(e) => setCreateForm({ ...createForm, occupation: e.target.value })}
                  placeholder="Chief Technology Officer"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={createForm.dob}
                  onChange={(e) => setCreateForm({ ...createForm, dob: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Gender</label>
                <select
                  value={createForm.gender}
                  onChange={(e) => setCreateForm({ ...createForm, gender: e.target.value })}
                  className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Financial Opening Balances Section */}
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                <Landmark className="h-4 w-4" />
                <span>Account Currency & Opening Treasury Balances</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Account Currency</label>
                  <select
                    value={createForm.preferredCurrency}
                    onChange={(e) => setCreateForm({ ...createForm, preferredCurrency: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  >
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                    <option value="CAD">CAD ($ - Canadian Dollar)</option>
                    <option value="CHF">CHF (Fr - Swiss Franc)</option>
                    <option value="AUD">AUD ($ - Australian Dollar)</option>
                    <option value="JPY">JPY (¥ - Japanese Yen)</option>
                    <option value="SGD">SGD ($ - Singapore Dollar)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Initial Checking Balance ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={createForm.initialCheckingBalance}
                    onChange={(e) => setCreateForm({ ...createForm, initialCheckingBalance: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Initial High-Yield Vault ($ — 5.15% APY)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={createForm.initialSavingsBalance}
                    onChange={(e) => setCreateForm({ ...createForm, initialSavingsBalance: e.target.value })}
                    placeholder="0.00"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs font-semibold text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Opening Transaction Narration</label>
                <input
                  type="text"
                  value={createForm.openingNarration}
                  onChange={(e) => setCreateForm({ ...createForm, openingNarration: e.target.value })}
                  placeholder="e.g. Initial Treasury Allocation / Opening Grant"
                  className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Governance & Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Banking Tier</label>
                <select
                  value={createForm.tier}
                  onChange={(e) => setCreateForm({ ...createForm, tier: e.target.value as any })}
                  className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                >
                  <option value="World Elite">World Elite Titanium</option>
                  <option value="Platinum">Platinum Preferred</option>
                  <option value="Private Client">Private Client Sovereign</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Account Status</label>
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm({ ...createForm, status: e.target.value as any })}
                  className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                >
                  <option value="Active">Active & Operational</option>
                  <option value="Verified">Verified Elite</option>
                  <option value="Pending KYC">Pending KYC</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Administrative Approval</label>
                <select
                  value={createForm.approvalStatus}
                  onChange={(e) => setCreateForm({ ...createForm, approvalStatus: e.target.value as any })}
                  className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                >
                  <option value="Approved">Approved Immediately</option>
                  <option value="Pending Approval">Pending Approval</option>
                </select>
              </div>
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:brightness-110 px-5 py-2 text-xs font-bold text-black shadow-[0_0_20px_rgba(249,115,22,0.4)] cursor-pointer"
              >
                <Check className="h-4 w-4 inline mr-1" />
                Provision Client Account
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT USER PROFILE MODAL */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="border border-orange-500/30 bg-zinc-950 text-white backdrop-blur-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white text-lg font-bold">
              <Edit3 className="h-5 w-5 text-orange-400" />
              <span>Edit Client Profile — {editingUser?.profile.firstName} {editingUser?.profile.lastName}</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Modify personal details, residential data, banking tier, and authorization status. Changes immediately sync to the user's dashboard.
            </DialogDescription>
          </DialogHeader>

          {editingUser && (
            <form onSubmit={handleSaveProfile} className="space-y-4 mt-2 text-xs">
              {/* Profile Image & Identification */}
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                {profileForm.profilePic ? (
                  <img
                    src={profileForm.profilePic}
                    alt="Preview"
                    className="h-14 w-14 rounded-full object-cover border-2 border-orange-500 shadow-glow"
                  />
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/40">
                    <Camera className="h-6 w-6" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <label className="block font-semibold text-zinc-300">Profile Picture / Avatar URL</label>
                  <input
                    type="text"
                    value={profileForm.profilePic || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, profilePic: e.target.value })}
                    placeholder="https://... image URL or Base64 data"
                    className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-1.5 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.firstName || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Middle Name</label>
                  <input
                    type="text"
                    value={profileForm.middleName || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, middleName: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.lastName || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.phone || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Residence & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={profileForm.address || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Country of Residence</label>
                  <input
                    type="text"
                    value={profileForm.country || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={profileForm.nationality || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, nationality: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Occupation</label>
                  <input
                    type="text"
                    value={profileForm.occupation || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={profileForm.dob || ""}
                    onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500 [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-300 mb-1">Gender</label>
                  <select
                    value={profileForm.gender || "Not specified"}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                    className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Status and Governance Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-3">
                <div>
                  <label className="block font-semibold text-orange-400 mb-1">KYC / Account Status</label>
                  <select
                    value={profileForm.status || "Active"}
                    onChange={(e) => setProfileForm({ ...profileForm, status: e.target.value as any })}
                    className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending KYC">Pending KYC</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-orange-400 mb-1">Administrative Approval</label>
                  <select
                    value={approvalStatusForm}
                    onChange={(e) => setApprovalStatusForm(e.target.value as any)}
                    className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  >
                    <option value="Approved">Approved</option>
                    <option value="Pending Approval">Pending Approval</option>
                    <option value="Declined">Declined</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-orange-400 mb-1">Banking Tier</label>
                  <select
                    value={profileForm.tier || "World Elite"}
                    onChange={(e) => setProfileForm({ ...profileForm, tier: e.target.value as any })}
                    className="w-full rounded-xl border border-white/15 bg-zinc-900 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  >
                    <option value="World Elite">World Elite</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Private Client">Private Client</option>
                  </select>
                </div>
              </div>

              <DialogFooter className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-500 hover:bg-orange-400 px-5 py-2 text-xs font-bold text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                >
                  Save Profile Changes
                </button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Clear All Users */}
      <Dialog open={clearModalOpen} onOpenChange={setClearModalOpen}>
        <DialogContent className="border border-rose-500/30 bg-zinc-950 text-white backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-400 text-lg font-bold">
              <AlertTriangle className="h-5 w-5" />
              <span>Clear All Users & Reset Ledger?</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs mt-2">
              This action will permanently delete all registered user accounts, reset all account
              balances to clean defaults, and wipe customer banking data from local storage.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <p className="text-xs text-zinc-300">
              To proceed, please type <strong className="text-rose-400 font-mono">CLEAR ALL</strong> below:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type CLEAR ALL"
              className="w-full rounded-xl border border-rose-500/30 bg-white/5 px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            <button
              onClick={() => {
                setClearModalOpen(false);
                setConfirmText("");
              }}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={handleClearAll}
              disabled={confirmText.trim().toUpperCase() !== "CLEAR ALL"}
              className="rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white transition-all disabled:opacity-40"
            >
              Confirm Clear All Users
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
