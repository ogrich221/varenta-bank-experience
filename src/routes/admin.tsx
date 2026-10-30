import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldAlert, Users, CreditCard, Send, ArrowDownLeft, ArrowUpRight,
  CheckCircle2, XCircle, Clock, AlertTriangle, Plus, Trash2, Calendar,
  FileText, Search, Filter, ThumbsUp, ThumbsDown, DollarSign, RefreshCw,
  Eye, Check, X, ShieldCheck, UserCheck, UserX, Download, ArrowRight,
  Building2, Sparkles, Scale, Lock
} from "lucide-react";
import { useBanking } from "@/lib/banking-context";
import { PageShell, btnPrimary, btnGlass } from "@/components/site/Layout";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Treasury Administration & Approvals — Varenta Bank" },
      { name: "description", content: "Master administration desk for user approvals, balance credit/debit operations, and transaction settlement." },
    ],
  }),
  component: AdminPage,
});

type AdminTab = "approvals" | "terminal" | "users" | "ledger";

export function AdminPage() {
  const {
    managedUsers,
    clearAllUsers,
    switchActiveUser,
    adminApproveUser,
    adminDeclineUser,
    adminCreditUser,
    adminDebitUser,
    adminApproveTransaction,
    adminDeclineTransaction,
    transactions,
  } = useBanking();

  const [activeTab, setActiveTab] = useState<AdminTab>("approvals");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Credit / Debit Terminal State
  const [selectedUserId, setSelectedUserId] = useState<string>(
    managedUsers[0] ? managedUsers[0].id : ""
  );
  const [terminalAction, setTerminalAction] = useState<"credit" | "debit">("credit");
  const [terminalAccount, setTerminalAccount] = useState<"Current Account" | "Savings Account">("Current Account");
  const [terminalAmount, setTerminalAmount] = useState<string>("10000");
  const [terminalDate, setTerminalDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [terminalNarration, setTerminalNarration] = useState<string>(
    "Direct Treasury Liquidity Wire Credit"
  );
  const [terminalFeedback, setTerminalFeedback] = useState<string>("");

  // Ledger Filter State
  const [ledgerSearch, setLedgerSearch] = useState<string>("");
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState<string>("All");

  // Selected User for KYC Inspection modal
  const [inspectUser, setInspectUser] = useState<any | null>(null);

  // Pending transactions awaiting admin decision
  const pendingTransactions = transactions.filter((t) => t.status === "Pending");
  const pendingUsers = managedUsers.filter((u) => u.approvalStatus === "Pending Approval");

  // Handle Credit / Debit Submission
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      alert("Please select a target client.");
      return;
    }

    const amountNum = Number(terminalAmount);
    if (!amountNum || amountNum <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (terminalAction === "credit") {
      adminCreditUser({
        userId: selectedUserId,
        accountType: terminalAccount,
        amount: amountNum,
        date: terminalDate,
        narration: terminalNarration,
      });
      setTerminalFeedback(`Successfully CREDITED +$${amountNum.toLocaleString()} USD to user ${selectedUserId}`);
    } else {
      adminDebitUser({
        userId: selectedUserId,
        accountType: terminalAccount,
        amount: amountNum,
        date: terminalDate,
        narration: terminalNarration,
      });
      setTerminalFeedback(`Successfully DEBITED -$${amountNum.toLocaleString()} USD from user ${selectedUserId}`);
    }

    setTimeout(() => setTerminalFeedback(""), 4000);
  };

  // Download Bank Audit Report
  const downloadAuditReport = () => {
    const lines = [
      "============================================================",
      "             VARENTA BANK AUDIT LEDGER REPORT              ",
      "============================================================",
      `Generated At: ${new Date().toISOString()}`,
      `Total Managed Users: ${managedUsers.length}`,
      `Total Recorded Transactions: ${transactions.length}`,
      `Pending Transactions Awaiting Clearance: ${pendingTransactions.length}`,
      "------------------------------------------------------------",
      "TXN ID      | User           | Type             | Amount       | Status",
      "------------------------------------------------------------",
      ...transactions.map(
        (t) =>
          `${t.id} | ${(t.userName || "Client").padEnd(14)} | ${t.type.padEnd(16)} | $${t.amount.toFixed(2).padStart(10)} | ${t.status}`
      ),
      "============================================================",
      "Authorized by Varenta Central Banking Oversight Desk",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Varenta_Audit_Ledger_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedUserObj = managedUsers.find((u) => u.id === selectedUserId) || managedUsers[0];

  return (
    <PageShell>
      <div className="min-h-screen px-4 pb-24 pt-32 sm:px-8">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -left-20 top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="mx-auto max-w-7xl">
          {/* Header & Metrics Strip */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/15 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <ShieldAlert className="h-4 w-4" />
                Administrative Command Center
              </div>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-foreground">
                Treasury & <span className="text-gradient">Operations Desk</span>
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Live oversight of user balances, credit/debit adjustments, and transaction clearance.
              </p>
            </div>

            {/* Clear All Users Action */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-all shadow-sm"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All Users</span>
              </button>

              <Link to="/dashboard" className={btnGlass}>
                View Client Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="glass rounded-3xl p-5 border border-white/20 shadow-glass">
              <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <Users className="h-4 w-4 text-primary" /> Total Registered Users
              </span>
              <p className="mt-2 font-display text-3xl font-bold text-foreground">
                {managedUsers.length}
              </p>
            </div>

            <div className="glass rounded-3xl p-5 border border-white/20 shadow-glass">
              <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-400" /> Pending Txn Approvals
              </span>
              <p className="mt-2 font-display text-3xl font-bold text-amber-400">
                {pendingTransactions.length}
              </p>
            </div>

            <div className="glass rounded-3xl p-5 border border-white/20 shadow-glass">
              <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-green-400" /> Pending KYC Approvals
              </span>
              <p className="mt-2 font-display text-3xl font-bold text-green-400">
                {pendingUsers.length}
              </p>
            </div>

            <div className="glass rounded-3xl p-5 border border-white/20 shadow-glass">
              <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-primary" /> Total Recorded Wires
              </span>
              <p className="mt-2 font-display text-3xl font-bold text-foreground">
                {transactions.length}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-border/40 pb-4">
            {[
              { id: "approvals", label: `Approvals Queue (${pendingTransactions.length})`, icon: Clock },
              { id: "terminal", label: "Credit & Debit Terminal", icon: Scale },
              { id: "users", label: `Client Directory (${managedUsers.length})`, icon: Users },
              { id: "ledger", label: "Global Ledger & Audits", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-glow scale-105"
                      : "border border-border/60 bg-background/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ================= TAB 1: TRANSACTION APPROVALS DESK ================= */}
          {activeTab === "approvals" && (
            <div className="mt-8 animate-rise space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Pending <span className="text-gradient">Transaction Approvals</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    "Admin should be the one to approve or decline all transactions."
                  </p>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {pendingTransactions.length} Pending Clearances
                </span>
              </div>

              {pendingTransactions.length === 0 ? (
                <div className="glass rounded-[2.5rem] p-12 text-center border border-white/20">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-green-400 mb-3 opacity-80" />
                  <h3 className="text-lg font-bold text-foreground">No Transactions Awaiting Review</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    All client transfers, domestic wires, and international settlements have been approved or cleared.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingTransactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="glass rounded-3xl p-6 border border-amber-500/30 shadow-glass flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary">{txn.id}</span>
                          <span className="rounded-full bg-amber-500/15 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> PENDING ADMIN DECISION
                          </span>
                          <span className="text-xs font-semibold text-foreground">
                            {txn.type}
                          </span>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase">
                              Originating Client
                            </span>
                            <span className="font-bold text-foreground">
                              {txn.userName || "Verified Client"} (ID: {txn.userId || "N/A"})
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px] uppercase">
                              Beneficiary Counterparty
                            </span>
                            <span className="font-bold text-foreground">
                              {txn.recipientOrSender}
                            </span>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          <strong>Narration / Memo:</strong> {txn.description}
                          {txn.recipientAccount && (
                            <span className="block font-mono text-[11px] mt-0.5">
                              Destination: {txn.recipientAccount} ({txn.recipientBank || "External"})
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-border/40 pt-4 lg:pt-0 lg:pl-6">
                        <div className="text-right">
                          <span className="text-[10px] text-muted-foreground uppercase font-mono block">
                            Held Transfer Amount
                          </span>
                          <span className="font-mono text-2xl font-bold text-foreground">
                            ${Math.abs(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {txn.currency}
                          </span>
                        </div>

                        {/* APPROVE / DECLINE BUTTONS */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => adminApproveTransaction(txn.id)}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-glow hover:brightness-105"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" /> Approve
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const reason = prompt("Enter decline reason (optional):", "Risk compliance check failed");
                              adminDeclineTransaction(txn.id, reason || undefined);
                            }}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/15 px-4 py-2 text-xs font-bold text-destructive hover:bg-destructive/25"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" /> Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: CREDIT & DEBIT TERMINAL ================= */}
          {activeTab === "terminal" && (
            <div className="mt-8 animate-rise space-y-6 max-w-3xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Admin <span className="text-gradient">Credit & Debit Terminal</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Direct balance adjustments with custom transaction date and custom narration.
                </p>
              </div>

              {terminalFeedback && (
                <div className="rounded-2xl bg-green-500/15 border border-green-500/40 p-4 text-xs font-bold text-green-300 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  {terminalFeedback}
                </div>
              )}

              <div className="glass rounded-[2.5rem] p-6 sm:p-10 border border-white/20 shadow-glass">
                <form onSubmit={handleTerminalSubmit} className="space-y-5 text-xs">
                  {/* Select User */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Select Target Client *
                    </label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-foreground font-semibold focus:border-primary focus:outline-none"
                    >
                      {managedUsers.length === 0 ? (
                        <option value="">No users registered</option>
                      ) : (
                        managedUsers.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.profile.firstName} {u.profile.lastName} ({u.id}) — Total: $
                            {u.accounts.reduce((s, a) => s + a.balance, 0).toFixed(2)} USD
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Action Selector: Credit vs Debit */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Operation Type *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTerminalAction("credit")}
                        className={`rounded-2xl p-3 font-bold flex items-center justify-center gap-2 transition-all ${
                          terminalAction === "credit"
                            ? "bg-green-500 text-white shadow-lg scale-102"
                            : "border border-border/60 bg-background/60 text-muted-foreground"
                        }`}
                      >
                        <ArrowDownLeft className="h-4 w-4" /> Credit Client (+)
                      </button>

                      <button
                        type="button"
                        onClick={() => setTerminalAction("debit")}
                        className={`rounded-2xl p-3 font-bold flex items-center justify-center gap-2 transition-all ${
                          terminalAction === "debit"
                            ? "bg-destructive text-white shadow-lg scale-102"
                            : "border border-border/60 bg-background/60 text-muted-foreground"
                        }`}
                      >
                        <ArrowUpRight className="h-4 w-4" /> Debit Client (-)
                      </button>
                    </div>
                  </div>

                  {/* Target Account & Amount */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        Target Sub-Account *
                      </label>
                      <select
                        value={terminalAccount}
                        onChange={(e) => setTerminalAccount(e.target.value as any)}
                        className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="Current Account">Current Account (Primary)</option>
                        <option value="Savings Account">High-Yield Savings (5.15% APY)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-1">
                        Adjustment Amount (USD) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        required
                        value={terminalAmount}
                        onChange={(e) => setTerminalAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 font-mono text-base font-bold text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* CUSTOM DATE OF TRANSACTION */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Choose Date of Transaction * (Supports Backdating)
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="date"
                        required
                        value={terminalDate}
                        onChange={(e) => setTerminalDate(e.target.value)}
                        className="w-full rounded-2xl border border-border/60 bg-background/80 pl-10 pr-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* CUSTOM NARRATION / MEMO */}
                  <div>
                    <label className="block font-semibold text-foreground mb-1">
                      Transaction Narration / Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={terminalNarration}
                      onChange={(e) => setTerminalNarration(e.target.value)}
                      placeholder="e.g. Direct Fedwire Inflow from Swiss Reserve"
                      className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-full font-bold text-xs shadow-glow transition-all ${
                      terminalAction === "credit"
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-destructive hover:bg-destructive/90 text-white"
                    }`}
                  >
                    Execute {terminalAction === "credit" ? "Credit (+)" : "Debit (-)"} Operation
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ================= TAB 3: CLIENT DIRECTORY & KYC ================= */}
          {activeTab === "users" && (
            <div className="mt-8 animate-rise space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Client <span className="text-gradient">Accounts Directory</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    View registered users, review KYC biometric selfies, and toggle approval statuses.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link to="/open-account" className={`${btnPrimary} py-2 text-xs`}>
                    <Plus className="h-3.5 w-3.5" /> Register New Client
                  </Link>
                </div>
              </div>

              {managedUsers.length === 0 ? (
                <div className="glass rounded-[2.5rem] p-12 text-center border border-white/20">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3 opacity-50" />
                  <h3 className="text-lg font-bold text-foreground">No Registered Users in System</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Users database has been cleared. Clients who register via "Open an Account" will appear here.
                  </p>
                  <Link to="/open-account" className={`${btnPrimary} mt-4 inline-flex`}>
                    Register New Client Account
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {managedUsers.map((u) => {
                    const userTotal = u.accounts.reduce((s, a) => s + a.balance, 0);
                    return (
                      <div
                        key={u.id}
                        className="glass rounded-3xl p-6 border border-white/20 shadow-glass flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className="font-mono text-[10px] text-primary font-bold">{u.id}</span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                u.approvalStatus === "Approved"
                                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                  : u.approvalStatus === "Pending Approval"
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : "bg-destructive/20 text-destructive border border-destructive/30"
                              }`}
                            >
                              {u.approvalStatus}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 mb-3">
                            {u.profile.profilePic ? (
                              <img
                                src={u.profile.profilePic}
                                alt={u.profile.firstName}
                                className="h-10 w-10 rounded-full object-cover border border-primary/50"
                              />
                            ) : (
                              <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                                {u.profile.firstName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold text-sm text-foreground">
                                {u.profile.firstName} {u.profile.lastName}
                              </h3>
                              <p className="text-[11px] text-muted-foreground">{u.profile.email}</p>
                            </div>
                          </div>

                          <div className="rounded-2xl bg-muted/20 p-3 text-xs space-y-1 font-mono">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Balance:</span>
                              <span className="font-bold text-foreground">${userTotal.toFixed(2)} USD</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Account #:</span>
                              <span>{u.profile.accountNumber}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-border/40 flex flex-wrap gap-2 justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              switchActiveUser(u.id);
                              setSelectedUserId(u.id);
                              setActiveTab("terminal");
                            }}
                            className="rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            Credit / Debit
                          </button>

                          {u.approvalStatus !== "Approved" ? (
                            <button
                              type="button"
                              onClick={() => adminApproveUser(u.id)}
                              className="rounded-full bg-green-500 px-3 py-1 text-xs text-white font-bold hover:bg-green-600"
                            >
                              Approve KYC
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => adminDeclineUser(u.id)}
                              className="rounded-full border border-destructive/40 text-destructive px-3 py-1 text-xs font-semibold hover:bg-destructive/10"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 4: BANK-WIDE LEDGER & AUDITS ================= */}
          {activeTab === "ledger" && (
            <div className="mt-8 animate-rise space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Bank-Wide <span className="text-gradient">Transaction Ledger</span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Immutable audit records of all deposits, wires, bill payments, and administrative adjustments.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={downloadAuditReport}
                  className={`${btnPrimary} py-2 text-xs`}
                >
                  <Download className="h-3.5 w-3.5" /> Download Full Audit Ledger
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    placeholder="Search by transaction ID, client name, or narration..."
                    className="w-full rounded-2xl border border-border/60 bg-background/70 pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <select
                  value={ledgerStatusFilter}
                  onChange={(e) => setLedgerStatusFilter(e.target.value)}
                  className="rounded-2xl border border-border/60 bg-background/70 px-4 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Successful">Successful</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Failed">Failed / Declined</option>
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-[2rem] border border-white/20 bg-background/60 shadow-glass">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/30 text-muted-foreground">
                      <th className="py-3 px-4 font-semibold">TXN ID</th>
                      <th className="py-3 px-4 font-semibold">Date</th>
                      <th className="py-3 px-4 font-semibold">User</th>
                      <th className="py-3 px-4 font-semibold">Type</th>
                      <th className="py-3 px-4 font-semibold">Narration / Counterparty</th>
                      <th className="py-3 px-4 font-semibold">Amount</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {transactions
                      .filter((t) => {
                        const matchSearch =
                          t.id.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
                          t.description.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
                          (t.userName || "").toLowerCase().includes(ledgerSearch.toLowerCase());
                        const matchStatus = ledgerStatusFilter === "All" || t.status === ledgerStatusFilter;
                        return matchSearch && matchStatus;
                      })
                      .map((t) => (
                        <tr key={t.id} className="hover:bg-muted/20">
                          <td className="py-3 px-4 font-mono font-semibold text-primary">{t.id}</td>
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">{t.date}</td>
                          <td className="py-3 px-4 font-semibold text-foreground">{t.userName || "Client"}</td>
                          <td className="py-3 px-4">{t.type}</td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-foreground">{t.recipientOrSender}</p>
                            <span className="text-[10px] text-muted-foreground">{t.description}</span>
                          </td>
                          <td
                            className={`py-3 px-4 font-mono font-bold whitespace-nowrap ${
                              t.amount > 0 ? "text-green-400" : "text-foreground"
                            }`}
                          >
                            {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toFixed(2)} {t.currency}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                t.status === "Successful"
                                  ? "bg-green-500/15 text-green-400 border border-green-500/30"
                                  : t.status === "Pending"
                                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                  : "bg-destructive/15 text-destructive border border-destructive/30"
                              }`}
                            >
                              {t.status === "Successful" && <ThumbsUp className="h-3 w-3" />}
                              {t.status === "Pending" && <Clock className="h-3 w-3" />}
                              {t.status === "Failed" && <X className="h-3 w-3" />}
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= CONFIRMATION MODAL: CLEAR ALL USERS ================= */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-rise">
          <div className="relative w-full max-w-md rounded-[2.5rem] border border-destructive/40 bg-background/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15 text-destructive border border-destructive/30 mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-bold text-foreground">Clear All Users From Admin?</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              This action will completely wipe all registered client profiles, accounts, balances, and transaction history, resetting the administration desk to a clean slate.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 rounded-full border border-border/60 py-2.5 text-xs text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearAllUsers();
                  setShowClearConfirm(false);
                }}
                className="flex-1 rounded-full bg-destructive py-2.5 text-xs font-bold text-white hover:bg-destructive/90"
              >
                Yes, Clear All Users
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
