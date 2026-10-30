import type { ManagedUser } from "./banking-store";

/** Flattens a managed customer into the fields the admin tables display. */
export function toAdminView(u: ManagedUser) {
  const current = u.accounts.find((a) => a.type === "Current Account");
  const savings = u.accounts.find((a) => a.type === "Savings Account");
  const checkingBalance = current?.balance ?? 0;
  const savingsBalance = savings?.balance ?? 0;
  return {
    ...u,
    name: `${u.profile.firstName} ${u.profile.lastName}`.trim(),
    email: u.profile.email,
    phone: u.profile.phone,
    avatarUrl:
      u.profile.profilePic ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.profile.firstName + " " + u.profile.lastName)}`,
    accounts: {
      accountNumber: current?.accountNumber ?? savings?.accountNumber ?? u.profile.accountNumber,
      checkingBalance,
      savingsBalance,
      totalBalance: checkingBalance + savingsBalance,
      currency: current?.currency ?? savings?.currency ?? "USD",
    },
  };
}

export const toAccountType = (k: "checking" | "savings") =>
  k === "savings" ? ("Savings Account" as const) : ("Current Account" as const);
