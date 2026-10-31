import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Users, Search, ShieldCheck, Trash2, PlusCircle, MinusCircle,
  Calendar, FileText, DollarSign, AlertTriangle, ArrowUpDown, Edit3,
  ExternalLink, Snowflake, Sun, Eye, UserPlus, X, Camera, Landmark, Check
} from "lucide-react";
import { toast } from "sonner";
import { useBanking, formatCurrency } from "@/lib/banking-context";
import { ManagedUser, UserProfile } from "@/lib/banking-store";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/customers")({
  staticData: { sitemap: false },
  validateSearch: (s: Record<string, unknown>): { q?: string } => (typeof s["q"] === "string" && s["q"] ? { q: s["q"] } : {}),
  head: () => ({
    meta: [{ title: "Customer Directory & Profile Editor — Varenta Admin" }],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate();
  const {
    managedUsers,
    clearAllUsers,
    switchActiveUser,
    adminCreateUser,
    adminCreditUser,
    adminDebitUser,
    adminUpdateUserProfile,
  } = useBanking();

  // Search & Filter
  const [filterQuery, setFilterQuery] = useState(q);
  const [statusFilter, setStatusFilter] = useState("all");

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

  // Edit Profile Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [profileForm, setProfileForm] = useState<Partial<UserProfile>>({});
  const [approvalStatusForm, setApprovalStatusForm] = useState<"Approved" | "Pending Approval" | "Declined" | "Suspended">("Approved");

  // Credit / Debit Modal State
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [actionType, setActionType] = useState<"credit" | "debit">("credit");
  const [accountType, setAccountType] = useState<"Current Account" | "Savings Account">("Current Account");
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
    return managedUsers.filter((u) => {
      if (statusFilter !== "all") {
        if (statusFilter === "active" && u.profile.status !== "Active" && u.profile.status !== "Verified") return false;
        if (statusFilter === "pending" && u.profile.status !== "Pending KYC" && u.approvalStatus !== "Pending Approval") return false;
        if (statusFilter === "suspended" && u.profile.status !== "Suspended" && u.approvalStatus !== "Suspended") return false;
      }
      if (!needle) return true;
      const fullName = `${u.profile.firstName} ${u.profile.lastName}`.toLowerCase();
      const email = u.profile.email.toLowerCase();
      const phone = u.profile.phone.toLowerCase();
      const acc = (u.accounts[0]?.accountNumber || u.profile.accountNumber || "").toLowerCase();
      return fullName.includes(needle) || email.includes(needle) || phone.includes(needle) || acc.includes(needle);
    });
  }, [managedUsers, filterQuery, q, statusFilter]);

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

  // Open Adjust Balance Modal
  const handleOpenAdjust = (user: ManagedUser) => {
    setSelectedUser(user);
    setAmountStr("");
    setNarration("");
    setAdjustModalOpen(true);
  };

  // Execute Credit/Debit
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
      const parsedDate = customDate ? new Date(customDate).toISOString().replace("T", " ").substring(0, 16) : new Date().toISOString();
      if (actionType === "credit") {
        adminCreditUser({
          userId: selectedUser.id,
          amount: num,
          accountType,
          narration: narration.trim(),
          date: parsedDate,
        });
        toast.success(`Successfully credited ${formatCurrency(num)} to ${selectedUser.profile.firstName}`);
      } else {
        adminDebitUser({
          userId: selectedUser.id,
          amount: num,
          accountType,
          narration: narration.trim(),
          date: parsedDate,
        });
        toast.success(`Successfully debited ${formatCurrency(num)} from ${selectedUser.profile.firstName}`);
      }
      setAdjustModalOpen(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to adjust balance");
    }
  };

  // Switch to Client View
  const handleViewAsClient = (userId: string) => {
    switchActiveUser(userId);
    toast.success("Switched active user session to selected client");
    navigate({ to: "/dashboard" });
  };

  // Quick Toggle Freeze/Unfreeze
  const handleToggleFreeze = (user: ManagedUser) => {
    const isSuspended = user.profile.status === "Suspended" || user.approvalStatus === "Suspended";
    const nextStatus = isSuspended ? "Active" : "Suspended";
    const nextApproval = isSuspended ? "Approved" : "Suspended";
    adminUpdateUserProfile(user.id, { status: nextStatus }, nextApproval);
    toast.info(isSuspended ? `Unfroze ${user.profile.firstName}'s account` : `Suspended ${user.profile.firstName}'s account`);
  };

  // Clear All Users
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
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-3">
            <span>Customer Book & Profiles</span>
            <span className="rounded-full bg-orange-500/20 border border-orange-500/40 px-2.5 py-0.5 text-xs font-mono font-bold text-orange-400">
              {managedUsers.length} Total
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Complete authority to create new clients, edit profiles, adjust account balances, and audit accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Create Client Button */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:brightness-110 px-4 py-2 text-xs font-bold text-black shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" />
            <span>Create New Client</span>
          </button>

          <Link
            to="/open-account"
            className="hidden md:flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all"
            title="Open customer self-serve registration page"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Self-Serve KYC Form</span>
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

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            value={filterQuery}
            onChange={(e) => {
              setFilterQuery(e.target.value);
              navigate({ search: e.target.value ? { q: e.target.value } : {}, replace: true });
            }}
            placeholder="Search by name, email, phone, account number..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl bg-white/5 p-1 border border-white/10 text-xs">
          {(["all", "active", "pending", "suspended"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1 font-semibold capitalize transition-all ${
                statusFilter === s
                  ? "bg-orange-500 text-black shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="mx-auto h-10 w-10 text-zinc-600" />
            <p className="mt-3 text-sm text-zinc-400">No customers found</p>
            <p className="text-xs text-zinc-600 mt-1 mb-4">
              {managedUsers.length === 0
                ? "No clients have registered yet. Provision a new client directly."
                : "No customers match your search criteria."}
            </p>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-black shadow"
            >
              <UserPlus className="h-4 w-4" />
              <span>Create First Client</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 text-zinc-400 font-mono text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Client Identity</th>
                  <th className="py-3.5 px-4">Account Number</th>
                  <th className="py-3.5 px-4">Checking Balance</th>
                  <th className="py-3.5 px-4">Savings Balance</th>
                  <th className="py-3.5 px-4">Total Balance</th>
                  <th className="py-3.5 px-4">Status & KYC</th>
                  <th className="py-3.5 px-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((u) => {
                  const fullName = `${u.profile.firstName} ${u.profile.lastName}`;
                  const checking = u.accounts.find((a) => a.type === "Current Account")?.balance ?? 0;
                  const savings = u.accounts.find((a) => a.type === "Savings Account")?.balance ?? 0;
                  const total = u.accounts.reduce((s, a) => s + a.balance, 0);
                  const avatar = u.profile.profilePic || u.kycSelfie;
                  const accNum = u.accounts[0]?.accountNumber || u.profile.accountNumber;
                  const isSuspended = u.profile.status === "Suspended" || u.approvalStatus === "Suspended";

                  return (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={fullName}
                              className="h-10 w-10 rounded-full object-cover border border-orange-500/30"
                            />
                          ) : (
                            <div className="grid h-10 w-10 place-items-center rounded-full bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                              {u.profile.firstName[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white flex items-center gap-1.5">
                              <span>{fullName}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                                {u.profile.tier}
                              </span>
                            </p>
                            <p className="text-[11px] text-zinc-400">{u.profile.email}</p>
                            <p className="text-[10px] text-zinc-500">
                              {u.profile.phone} · {u.profile.country}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {accNum}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-white">
                        {formatCurrency(checking, u.profile.preferredCurrency)}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-white">
                        {formatCurrency(savings, u.profile.preferredCurrency)}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-orange-400 text-sm">
                        {formatCurrency(total, u.profile.preferredCurrency)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {isSuspended ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                              <Snowflake className="h-3 w-3" />
                              <span>Suspended</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                              <ShieldCheck className="h-3 w-3" />
                              <span>{u.profile.status}</span>
                            </span>
                          )}
                          <p className="text-[10px] text-zinc-500 font-mono">
                            Approval: {u.approvalStatus}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Edit Profile Button */}
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="inline-flex items-center gap-1 rounded-lg bg-orange-500/10 border border-orange-500/30 px-2.5 py-1 text-xs font-semibold text-orange-400 hover:bg-orange-500/20 transition-all"
                            title="Edit user profile details"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit Profile</span>
                          </button>

                          {/* Credit / Debit Button */}
                          <button
                            onClick={() => handleOpenAdjust(u)}
                            className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-semibold text-zinc-300 hover:bg-white/10 hover:text-white transition-all"
                            title="Credit or Debit user"
                          >
                            <ArrowUpDown className="h-3 w-3" />
                            <span>Credit/Debit</span>
                          </button>

                          {/* View As Client Button */}
                          <button
                            onClick={() => handleViewAsClient(u.id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                            title="Open client's personal dashboard"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View As Client</span>
                          </button>

                          {/* Freeze / Unfreeze Button */}
                          <button
                            onClick={() => handleToggleFreeze(u)}
                            className={`p-1 rounded-lg border transition-all ${
                              isSuspended
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                                : "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                            }`}
                            title={isSuspended ? "Unfreeze Client" : "Suspend Client"}
                          >
                            {isSuspended ? <Sun className="h-3.5 w-3.5" /> : <Snowflake className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
              Directly onboard and provision a verified Varenta Bank client with checking & savings accounts, virtual debit card, and optional opening treasury balances.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClient} className="space-y-4 mt-2 text-xs">
            {/* Identity details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={createForm.firstName}
                  onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                  placeholder="e.g. Marcus"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Middle Name</label>
                <input
                  type="text"
                  value={createForm.middleName}
                  onChange={(e) => setCreateForm({ ...createForm, middleName: e.target.value })}
                  placeholder="Optional"
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
                  placeholder="e.g. Vance"
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
                  placeholder="marcus.vance@company.com"
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  placeholder="+1 (555) 392-1082"
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
                  <label className="block font-semibold text-zinc-300 mb-1">Initial Savings Balance ($)</label>
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
                className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:brightness-110 px-5 py-2 text-xs font-bold text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]"
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

      {/* CREDIT / DEBIT MODAL */}
      <Dialog open={adjustModalOpen} onOpenChange={setAdjustModalOpen}>
        <DialogContent className="border border-orange-500/30 bg-zinc-950 text-white backdrop-blur-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white text-base font-bold">
              <DollarSign className="h-4 w-4 text-orange-400" />
              <span>Credit or Debit {selectedUser?.profile.firstName} {selectedUser?.profile.lastName}</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Directly adjust account balance with custom timestamp and narration.
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <form onSubmit={handleExecuteAdjust} className="space-y-4 mt-2 text-xs">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="font-bold text-white">
                  {selectedUser.profile.firstName} {selectedUser.profile.lastName}
                </p>
                <p className="text-zinc-400 text-[11px] font-mono">
                  Account: {selectedUser.accounts[0]?.accountNumber || selectedUser.profile.accountNumber}
                </p>
                <p className="text-orange-400 font-bold mt-1">
                  Current Total: {formatCurrency(selectedUser.accounts.reduce((s, a) => s + a.balance, 0))}
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
                    onClick={() => setAccountType("Current Account")}
                    className={`rounded-xl py-1.5 px-3 text-xs font-semibold border ${
                      accountType === "Current Account"
                        ? "bg-orange-500/20 border-orange-500 text-orange-400"
                        : "bg-white/5 border-white/10 text-zinc-400"
                    }`}
                  >
                    Checking Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("Savings Account")}
                    className={`rounded-xl py-1.5 px-3 text-xs font-semibold border ${
                      accountType === "Savings Account"
                        ? "bg-orange-500/20 border-orange-500 text-orange-400"
                        : "bg-white/5 border-white/10 text-zinc-400"
                    }`}
                  >
                    Savings Account
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

      {/* CONFIRMATION DIALOG FOR CLEAR ALL USERS */}
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
