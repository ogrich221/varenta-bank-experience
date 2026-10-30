import { toAdminView, toAccountType } from "@/lib/admin-view";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users, Search, ShieldCheck, Trash2, PlusCircle, MinusCircle,
  Calendar, FileText, DollarSign, AlertTriangle, ArrowUpDown
} from "lucide-react";
import { toast } from "sonner";
import { useBanking } from "@/lib/banking-context";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/customers")({
  staticData: { sitemap: false },
  validateSearch: (s: Record<string, unknown>): { q?: string } => (typeof s["q"] === "string" && s["q"] ? { q: s["q"] } : {}),
  head: () => ({
    meta: [{ title: "Customer Book — Varenta Admin" }],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/customers" });
  const {
    managedUsers: rawManagedUsers,
    clearAllUsers,
    adminCreditUser,
    adminDebitUser,
    formatCurrency,
  } = useBanking();
  const managedUsers = useMemo(() => rawManagedUsers.map(toAdminView), [rawManagedUsers]);

  // Search & Filter
  const [filterQuery, setFilterQuery] = useState(q);

  // Credit / Debit Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionType, setActionType] = useState<"credit" | "debit">("credit");
  const [accountType, setAccountType] = useState<"checking" | "savings">("checking");
  const [amountStr, setAmountStr] = useState("");
  const [narration, setNarration] = useState("");
  const [customDate, setCustomDate] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  // Clear All Modal State
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const filteredUsers = useMemo(() => {
    const needle = (filterQuery || q).toLowerCase().trim();
    if (!needle) return managedUsers;
    return managedUsers.filter(
      (u) =>
        u.name.toLowerCase().includes(needle) ||
        u.email.toLowerCase().includes(needle) ||
        u.accounts.accountNumber.toLowerCase().includes(needle)
    );
  }, [managedUsers, filterQuery, q]);

  const handleOpenAdjust = (user: any) => {
    setSelectedUser(user);
    setAmountStr("");
    setNarration("");
    setAdjustModalOpen(true);
  };

  const handleExecuteAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const num = parseFloat(amountStr);
    if (isNaN(num) || num <= 0) {
      toast.error("Please enter a valid amount greater than $0.00");
      return;
    }
    if (!narration.trim()) {
      toast.error("Please input a transaction narration or memo");
      return;
    }

    try {
      const parsedDate = customDate ? new Date(customDate).toISOString() : new Date().toISOString();
      if (actionType === "credit") {
        adminCreditUser({ userId: selectedUser.id, accountType: toAccountType(accountType), amount: num, date: parsedDate, narration: narration.trim() });
        toast.success(`Successfully credited ${formatCurrency(num)} to ${selectedUser.name}`);
      } else {
        adminDebitUser({ userId: selectedUser.id, accountType: toAccountType(accountType), amount: num, date: parsedDate, narration: narration.trim() });
        toast.success(`Successfully debited ${formatCurrency(num)} from ${selectedUser.name}`);
      }
      setAdjustModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to adjust balance");
    }
  };

  const handleClearAll = () => {
    if (confirmText.trim().toUpperCase() !== "CLEAR ALL") {
      toast.error('Please type "CLEAR ALL" to confirm');
      return;
    }
    clearAllUsers();
    setClearModalOpen(false);
    setConfirmText("");
    toast.success("All users cleared successfully");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Customer Book</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Identity, account numbers, and live balance control for every client.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/open-account"
            className="flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-400 px-3.5 py-2 text-xs font-bold text-black shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Open New Account</span>
          </Link>

          <button
            onClick={() => setClearModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear All Users</span>
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            value={filterQuery}
            onChange={(e) => {
              setFilterQuery(e.target.value);
              navigate({ search: e.target.value ? { q: e.target.value } : {}, replace: true });
            }}
            placeholder="Search by client name, email, or account number..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-orange-500"
          />
        </div>

        <div className="text-xs text-zinc-400 font-mono">
          Showing {filteredUsers.length} of {managedUsers.length} registered clients
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="mx-auto h-10 w-10 text-zinc-600" />
            <p className="mt-3 text-sm text-zinc-400">No customers found</p>
            <p className="text-xs text-zinc-600 mt-1">
              {managedUsers.length === 0
                ? "No clients have registered yet. Use Open Account to create one."
                : "No customers match your search criteria."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 text-zinc-400 font-mono text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Client Details</th>
                  <th className="py-3.5 px-4">Account Number</th>
                  <th className="py-3.5 px-4">Checking Balance</th>
                  <th className="py-3.5 px-4">Savings Balance</th>
                  <th className="py-3.5 px-4">Total Balance</th>
                  <th className="py-3.5 px-4">KYC Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="h-9 w-9 rounded-full object-cover border border-orange-500/30"
                        />
                        <div>
                          <p className="font-bold text-white">{u.name}</p>
                          <p className="text-[11px] text-zinc-400">{u.email}</p>
                          <p className="text-[10px] text-zinc-500">{u.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-zinc-300">
                      {u.accounts.accountNumber}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {formatCurrency(u.accounts.checkingBalance, u.accounts.currency)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {formatCurrency(u.accounts.savingsBalance, u.accounts.currency)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-orange-400 text-sm">
                      {formatCurrency(u.accounts.totalBalance, u.accounts.currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenAdjust(u)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 text-xs font-semibold text-orange-400 hover:bg-orange-500/20 transition-all"
                      >
                        <ArrowUpDown className="h-3 w-3" />
                        <span>Credit / Debit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Credit / Debit Modal */}
      <Dialog open={adjustModalOpen} onOpenChange={setAdjustModalOpen}>
        <DialogContent className="border border-orange-500/30 bg-zinc-950 text-white backdrop-blur-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white text-base font-bold">
              <DollarSign className="h-4 w-4 text-orange-400" />
              <span>Credit or Debit {selectedUser?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Directly adjust account balance with custom timestamp and narration.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleExecuteAdjust} className="space-y-4 mt-2">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs">
                <p className="font-bold text-white">{selectedUser.name}</p>
                <p className="text-zinc-400 text-[11px] font-mono">
                  Account: {selectedUser.accounts.accountNumber}
                </p>
                <p className="text-orange-400 font-bold mt-1">
                  Current Total: {formatCurrency(selectedUser.accounts.totalBalance)}
                </p>
              </div>

              {/* Action type */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setActionType("credit")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold border transition-all ${
                    actionType === "credit"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                      : "bg-white/5 border-white/10 text-zinc-400"
                  }`}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Credit (+)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActionType("debit")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs font-bold border transition-all ${
                    actionType === "debit"
                      ? "bg-rose-500/20 border-rose-500 text-rose-400"
                      : "bg-white/5 border-white/10 text-zinc-400"
                  }`}
                >
                  <MinusCircle className="h-3.5 w-3.5" />
                  <span>Debit (-)</span>
                </button>
              </div>

              {/* Target Account */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Account</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType("checking")}
                    className={`rounded-xl py-1.5 px-3 text-xs font-semibold border ${
                      accountType === "checking"
                        ? "bg-orange-500/20 border-orange-500 text-orange-400"
                        : "bg-white/5 border-white/10 text-zinc-400"
                    }`}
                  >
                    Checking
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("savings")}
                    className={`rounded-xl py-1.5 px-3 text-xs font-semibold border ${
                      accountType === "savings"
                        ? "bg-orange-500/20 border-orange-500 text-orange-400"
                        : "bg-white/5 border-white/10 text-zinc-400"
                    }`}
                  >
                    Savings
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Amount (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>

              {/* Custom Date */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-orange-400" />
                  <span>Choose Date & Time</span>
                </label>
                <input
                  type="datetime-local"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500 [color-scheme:dark]"
                />
              </div>

              {/* Narration */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1">
                  <FileText className="h-3.5 w-3.5 text-orange-400" />
                  <span>Narration / Memo</span>
                </label>
                <input
                  type="text"
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="e.g. Administrative Ledger Adjustment"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-orange-500"
                />
              </div>

              <DialogFooter className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-orange-500 hover:bg-orange-400 px-4 py-2 text-xs font-bold text-black"
                >
                  Post Transaction
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
