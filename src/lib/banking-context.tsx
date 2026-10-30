import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  UserProfile,
  BankAccount,
  DebitCardDetails,
  Transaction,
  Beneficiary,
  ManagedUser,
  DEFAULT_USER,
  DEFAULT_DEBIT_CARD,
  DEFAULT_ACCOUNTS,
  INITIAL_MANAGED_USERS,
  INITIAL_TRANSACTIONS,
  INITIAL_BENEFICIARIES,
  EXCHANGE_RATES,
} from "./banking-store";

interface BankingContextType {
  // Current active user
  user: UserProfile;
  accounts: BankAccount[];
  totalBalance: number;
  isMasked: boolean;
  toggleMask: () => void;
  card: DebitCardDetails;
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  notifications: Array<{ id: string; title: string; time: string; read: boolean }>;

  // All Managed Users (Admin functionality)
  managedUsers: ManagedUser[];
  clearAllUsers: () => void;
  switchActiveUser: (userId: string) => void;
  registerNewUser: (profile: Omit<UserProfile, "id">, kycSelfie?: string) => ManagedUser;
  adminApproveUser: (userId: string) => void;
  adminDeclineUser: (userId: string) => void;

  // Admin Credit & Debit with Custom Date & Custom Narration
  adminCreditUser: (params: {
    userId: string;
    accountType: "Current Account" | "Savings Account";
    amount: number;
    date: string;
    narration: string;
  }) => Transaction;
  adminDebitUser: (params: {
    userId: string;
    accountType: "Current Account" | "Savings Account";
    amount: number;
    date: string;
    narration: string;
  }) => Transaction;

  // Admin Transaction Approvals & Declines
  adminApproveTransaction: (txnId: string) => void;
  adminDeclineTransaction: (txnId: string, reason?: string) => void;

  // User Actions
  updateProfile: (updated: Partial<UserProfile>) => void;
  toggleCardFreeze: () => void;
  updateCardLimit: (newLimit: number) => void;
  depositFunds: (amount: number, targetAccount: "Current Account" | "Savings Account", method: string) => Promise<{ success: boolean; txn: Transaction }>;
  transferDomestic: (params: {
    recipientName: string;
    bankName: string;
    accountNumber: string;
    bankAddress: string;
    amount: number;
    description: string;
    pin: string;
  }) => Promise<{ success: boolean; txn?: Transaction; error?: string }>;
  transferInternational: (params: {
    recipientName: string;
    country: string;
    bankName: string;
    swiftBic: string;
    iban: string;
    currency: string;
    amount: number;
    exchangeRate: number;
    convertedAmount: number;
    fee: number;
    description: string;
    pin: string;
  }) => Promise<{ success: boolean; txn?: Transaction; error?: string }>;
  payBill: (params: {
    category: string;
    provider: string;
    accountNumber: string;
    amount: number;
  }) => Promise<{ success: boolean; receiptNumber: string; error?: string }>;
  convertCurrency: (amount: number, from: string, to: string) => { converted: number; rate: number; fee: number };
  addBeneficiary: (ben: Omit<Beneficiary, "id">) => void;
  removeBeneficiary: (id: string) => void;
  markNotificationsRead: () => void;
  formatCurrency: (amount: number, currency?: string) => string;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export function BankingProvider({ children }: { children: ReactNode }) {
  // 1. Managed Users List (for Admin & Authentication)
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>(() => {
    try {
      const saved = localStorage.getItem("varenta_managed_users");
      return saved ? JSON.parse(saved) : INITIAL_MANAGED_USERS;
    } catch {
      return INITIAL_MANAGED_USERS;
    }
  });

  // Current active user ID
  const [activeUserId, setActiveUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("varenta_active_user_id");
      return saved || (managedUsers[0] ? managedUsers[0].id : "USR-884210");
    } catch {
      return "USR-884210";
    }
  });

  // Find active user object or fallback
  const activeManagedUser = managedUsers.find((u) => u.id === activeUserId) || managedUsers[0] || {
    id: "USR-DEFAULT",
    profile: DEFAULT_USER,
    accounts: DEFAULT_ACCOUNTS,
    card: DEFAULT_DEBIT_CARD,
    registeredAt: "2026-10-30 00:00",
    approvalStatus: "Approved",
  };

  const user = activeManagedUser.profile;
  const accounts = activeManagedUser.accounts;
  const card = activeManagedUser.card;

  // Mask sensitive information: HIDDEN BY DEFAULT as required
  const [isMasked, setIsMasked] = useState<boolean>(true);

  // Bank-wide transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem("varenta_customer_transactions");
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Beneficiaries
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    try {
      const saved = localStorage.getItem("varenta_customer_beneficiaries");
      return saved ? JSON.parse(saved) : INITIAL_BENEFICIARIES;
    } catch {
      return INITIAL_BENEFICIARIES;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: "notif-1", title: "Connected to Varenta Bank Administration Gateway.", time: "Just now", read: false },
    { id: "notif-2", title: "Admin approval required for outgoing wires and debit transactions.", time: "10 mins ago", read: false },
  ]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("varenta_managed_users", JSON.stringify(managedUsers));
    } catch { /* ignore */ }
  }, [managedUsers]);

  useEffect(() => {
    try {
      localStorage.setItem("varenta_active_user_id", activeUserId);
    } catch { /* ignore */ }
  }, [activeUserId]);

  useEffect(() => {
    try {
      localStorage.setItem("varenta_customer_transactions", JSON.stringify(transactions));
    } catch { /* ignore */ }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem("varenta_customer_beneficiaries", JSON.stringify(beneficiaries));
    } catch { /* ignore */ }
  }, [beneficiaries]);

  // Total Balance of active user
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  const toggleMask = () => setIsMasked((prev) => !prev);

  // Switch active user
  const switchActiveUser = (userId: string) => {
    setActiveUserId(userId);
  };

  // CLEAR ALL USERS FROM ADMIN
  const clearAllUsers = () => {
    setManagedUsers([]);
    setTransactions([]);
    setBeneficiaries([]);
    localStorage.removeItem("varenta_managed_users");
    localStorage.removeItem("varenta_customer_transactions");
    localStorage.removeItem("varenta_customer_beneficiaries");
  };

  // Register New User (called from Open Account)
  const registerNewUser = (profileData: Omit<UserProfile, "id">, kycSelfie?: string): ManagedUser => {
    const newId = `USR-${Math.floor(100000 + Math.random() * 900000)}`;
    const accNum1 = `VB-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-01`;
    const accNum2 = `VB-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-02`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newUser: ManagedUser = {
      id: newId,
      profile: {
        ...profileData,
        id: newId,
        accountNumber: accNum1,
        status: "Pending KYC",
        tier: "World Elite",
        profilePic: kycSelfie || "",
      },
      accounts: [
        {
          accountNumber: accNum1,
          type: "Current Account",
          balance: 0.0,
          currency: profileData.preferredCurrency || "USD",
          availableBalance: 0.0,
        },
        {
          accountNumber: accNum2,
          type: "Savings Account",
          balance: 0.0,
          currency: profileData.preferredCurrency || "USD",
          availableBalance: 0.0,
        },
      ],
      card: {
        cardNumber: `4920 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
        cardholderName: `${profileData.firstName} ${profileData.lastName}`.toUpperCase(),
        expiryDate: "12/31",
        cvv: Math.floor(100 + Math.random() * 900).toString(),
        isFrozen: false,
        dailyLimit: 25000,
        contactlessEnabled: true,
        onlinePaymentsEnabled: true,
        cardType: "World Elite Titanium",
      },
      registeredAt: now,
      approvalStatus: "Pending Approval",
      kycSelfie: kycSelfie || "",
    };

    setManagedUsers((prev) => [newUser, ...prev]);
    setActiveUserId(newId);
    return newUser;
  };

  // ADMIN APPROVE USER REGISTRATION
  const adminApproveUser = (userId: string) => {
    setManagedUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              approvalStatus: "Approved",
              profile: { ...u.profile, status: "Active" },
            }
          : u
      )
    );
  };

  // ADMIN DECLINE USER REGISTRATION
  const adminDeclineUser = (userId: string) => {
    setManagedUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              approvalStatus: "Declined",
              profile: { ...u.profile, status: "Suspended" },
            }
          : u
      )
    );
  };

  // ADMIN CREDIT USER WITH CUSTOM DATE & NARRATION
  const adminCreditUser = (params: {
    userId: string;
    accountType: "Current Account" | "Savings Account";
    amount: number;
    date: string;
    narration: string;
  }): Transaction => {
    const targetUser = managedUsers.find((u) => u.id === params.userId);
    const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newTxn: Transaction = {
      id: txnId,
      userId: params.userId,
      userName: targetUser ? `${targetUser.profile.firstName} ${targetUser.profile.lastName}` : "Client",
      date: params.date || new Date().toISOString().replace("T", " ").substring(0, 16),
      type: "Admin Credit",
      description: params.narration || "Official Credit by Varenta Treasury Desk",
      recipientOrSender: "Varenta Central Banking Authority",
      amount: params.amount,
      currency: "USD",
      status: "Successful",
      targetAccount: params.accountType,
      reference: `ADM-CR-${Math.floor(100000 + Math.random() * 900000)}`,
      adminNote: "Authorized by Administration",
    };

    // Update user's account balance
    setManagedUsers((prev) =>
      prev.map((u) => {
        if (u.id !== params.userId) return u;
        return {
          ...u,
          accounts: u.accounts.map((acc) => {
            if (acc.type !== params.accountType) return acc;
            const updated = Number((acc.balance + params.amount).toFixed(2));
            return {
              ...acc,
              balance: updated,
              availableBalance: updated,
            };
          }),
        };
      })
    );

    setTransactions((prev) => [newTxn, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Account Credited: +$${params.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${params.narration})`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    return newTxn;
  };

  // ADMIN DEBIT USER WITH CUSTOM DATE & NARRATION
  const adminDebitUser = (params: {
    userId: string;
    accountType: "Current Account" | "Savings Account";
    amount: number;
    date: string;
    narration: string;
  }): Transaction => {
    const targetUser = managedUsers.find((u) => u.id === params.userId);
    const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newTxn: Transaction = {
      id: txnId,
      userId: params.userId,
      userName: targetUser ? `${targetUser.profile.firstName} ${targetUser.profile.lastName}` : "Client",
      date: params.date || new Date().toISOString().replace("T", " ").substring(0, 16),
      type: "Admin Debit",
      description: params.narration || "Official Debit by Varenta Administration",
      recipientOrSender: "Varenta Banking Desk",
      amount: -params.amount,
      currency: "USD",
      status: "Successful",
      targetAccount: params.accountType,
      reference: `ADM-DB-${Math.floor(100000 + Math.random() * 900000)}`,
      adminNote: "Authorized by Administration",
    };

    // Update user's account balance
    setManagedUsers((prev) =>
      prev.map((u) => {
        if (u.id !== params.userId) return u;
        return {
          ...u,
          accounts: u.accounts.map((acc) => {
            if (acc.type !== params.accountType) return acc;
            const updated = Number((acc.balance - params.amount).toFixed(2));
            return {
              ...acc,
              balance: updated,
              availableBalance: updated,
            };
          }),
        };
      })
    );

    setTransactions((prev) => [newTxn, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Account Debited: -$${params.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${params.narration})`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    return newTxn;
  };

  // ADMIN APPROVE TRANSACTION (Gives thumbs up, finalizes settlement)
  const adminApproveTransaction = (txnId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txnId ? { ...t, status: "Successful" as const } : t))
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Transaction ${txnId} has been APPROVED by Varenta Administration.`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);
  };

  // ADMIN DECLINE TRANSACTION (Reverses funds back to user)
  const adminDeclineTransaction = (txnId: string, reason?: string) => {
    const targetTxn = transactions.find((t) => t.id === txnId);
    if (!targetTxn) return;

    // Set transaction status to Failed / Declined
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txnId
          ? {
              ...t,
              status: "Failed" as const,
              adminNote: reason || "Declined by Administration",
            }
          : t
      )
    );

    // If transaction had deducted money, reverse/refund it to the user's account
    if (targetTxn.amount < 0 && targetTxn.userId) {
      const refundAmount = Math.abs(targetTxn.amount) + (targetTxn.fee || 0);
      setManagedUsers((prev) =>
        prev.map((u) => {
          if (u.id !== targetTxn.userId) return u;
          return {
            ...u,
            accounts: u.accounts.map((acc) => {
              if (acc.type !== (targetTxn.targetAccount || "Current Account")) return acc;
              const restored = Number((acc.balance + refundAmount).toFixed(2));
              return {
                ...acc,
                balance: restored,
                availableBalance: restored,
              };
            }),
          };
        })
      );
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Transaction ${txnId} was DECLINED by Administration: ${reason || "Policy compliance check"}. Reserved funds restored.`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);
  };

  // Update profile
  const updateProfile = (updated: Partial<UserProfile>) => {
    setManagedUsers((prev) =>
      prev.map((u) =>
        u.id === activeUserId
          ? { ...u, profile: { ...u.profile, ...updated } }
          : u
      )
    );
  };

  const toggleCardFreeze = () => {
    setManagedUsers((prev) =>
      prev.map((u) =>
        u.id === activeUserId
          ? { ...u, card: { ...u.card, isFrozen: !u.card.isFrozen } }
          : u
      )
    );
  };

  const updateCardLimit = (newLimit: number) => {
    setManagedUsers((prev) =>
      prev.map((u) =>
        u.id === activeUserId
          ? { ...u, card: { ...u.card, dailyLimit: newLimit } }
          : u
      )
    );
  };

  // Deposit funds
  const depositFunds = async (
    amount: number,
    targetAccount: "Current Account" | "Savings Account",
    method: string
  ): Promise<{ success: boolean; txn: Transaction }> => {
    const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newTxn: Transaction = {
      id: txnId,
      userId: activeUserId,
      userName: `${user.firstName} ${user.lastName}`,
      date: now,
      type: "Deposit",
      description: `Inbound Capital Deposit via ${method}`,
      recipientOrSender: method,
      amount: amount,
      currency: "USD",
      status: "Successful",
      targetAccount: targetAccount,
      reference: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setManagedUsers((prev) =>
      prev.map((u) => {
        if (u.id !== activeUserId) return u;
        return {
          ...u,
          accounts: u.accounts.map((acc) => {
            if (acc.type !== targetAccount) return acc;
            const updated = Number((acc.balance + amount).toFixed(2));
            return {
              ...acc,
              balance: updated,
              availableBalance: updated,
            };
          }),
        };
      })
    );

    setTransactions((prev) => [newTxn, ...prev]);

    return { success: true, txn: newTxn };
  };

  // Domestic Transfer: ENTERS PENDING ADMIN APPROVAL STATE
  const transferDomestic = async (params: {
    recipientName: string;
    bankName: string;
    accountNumber: string;
    bankAddress: string;
    amount: number;
    description: string;
    pin: string;
  }): Promise<{ success: boolean; txn?: Transaction; error?: string }> => {
    const currentAcc = accounts.find((a) => a.type === "Current Account") || accounts[0];
    if (!currentAcc) return { success: false, error: "No account is available to debit." };


    if (currentAcc.balance < params.amount) {
      return {
        success: false,
        error: `Insufficient balance. Available balance: $${currentAcc.balance.toFixed(2)} USD. Please deposit funds first.`,
      };
    }

    const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newTxn: Transaction = {
      id: txnId,
      userId: activeUserId,
      userName: `${user.firstName} ${user.lastName}`,
      date: now,
      type: "Domestic Transfer",
      description: params.description || `Transfer to ${params.recipientName}`,
      recipientOrSender: `${params.recipientName} (${params.bankName})`,
      amount: -params.amount,
      currency: "USD",
      status: "Pending", // PENDING ADMIN APPROVAL
      recipientBank: params.bankName,
      recipientAccount: params.accountNumber,
      targetAccount: "Current Account",
      reference: `DOM-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    // Deduct from balance pending approval
    setManagedUsers((prev) =>
      prev.map((u) => {
        if (u.id !== activeUserId) return u;
        return {
          ...u,
          accounts: u.accounts.map((acc) => {
            if (acc.type !== "Current Account") return acc;
            const updated = Number((acc.balance - params.amount).toFixed(2));
            return {
              ...acc,
              balance: updated,
              availableBalance: updated,
            };
          }),
        };
      })
    );

    setTransactions((prev) => [newTxn, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Domestic wire submitted (-$${params.amount.toFixed(2)} USD). Pending administrative authorization.`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    return { success: true, txn: newTxn };
  };

  // International Transfer (EXCLUDING ALL AFRICAN COUNTRIES): ENTERS PENDING ADMIN APPROVAL
  const transferInternational = async (params: {
    recipientName: string;
    country: string;
    bankName: string;
    swiftBic: string;
    iban: string;
    currency: string;
    amount: number;
    exchangeRate: number;
    convertedAmount: number;
    fee: number;
    description: string;
    pin: string;
  }): Promise<{ success: boolean; txn?: Transaction; error?: string }> => {
    const totalDeduction = params.amount + params.fee;
    const currentAcc = accounts.find((a) => a.type === "Current Account") || accounts[0];
    if (!currentAcc) return { success: false, error: "No account is available to debit." };


    if (currentAcc.balance < totalDeduction) {
      return {
        success: false,
        error: `Insufficient balance for international wire + fee ($${totalDeduction.toFixed(2)} USD required). Current balance: $${currentAcc.balance.toFixed(2)} USD.`,
      };
    }

    const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newTxn: Transaction = {
      id: txnId,
      userId: activeUserId,
      userName: `${user.firstName} ${user.lastName}`,
      date: now,
      type: "International Wire",
      description: `SWIFT/RTGS to ${params.recipientName} (${params.country})`,
      recipientOrSender: `${params.recipientName} (${params.bankName} - ${params.country})`,
      amount: -params.amount,
      currency: "USD",
      status: "Pending", // PENDING ADMIN APPROVAL
      reference: `INTL-${Math.floor(100000 + Math.random() * 900000)}`,
      recipientBank: `${params.bankName} [${params.swiftBic}]`,
      recipientAccount: params.iban,
      targetAccount: "Current Account",
      fee: params.fee,
    };

    setManagedUsers((prev) =>
      prev.map((u) => {
        if (u.id !== activeUserId) return u;
        return {
          ...u,
          accounts: u.accounts.map((acc) => {
            if (acc.type !== "Current Account") return acc;
            const updated = Number((acc.balance - totalDeduction).toFixed(2));
            return {
              ...acc,
              balance: updated,
              availableBalance: updated,
            };
          }),
        };
      })
    );

    setTransactions((prev) => [newTxn, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `International Wire submitted (-$${params.amount.toFixed(2)} USD to ${params.recipientName}). Awaiting admin clearance.`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    return { success: true, txn: newTxn };
  };

  // Bill payment
  const payBill = async (params: {
    category: string;
    provider: string;
    accountNumber: string;
    amount: number;
  }): Promise<{ success: boolean; receiptNumber: string; error?: string }> => {
    const currentAcc = accounts.find((a) => a.type === "Current Account") || accounts[0];
    if (!currentAcc)
      return { success: false, receiptNumber: "", error: "No account is available to pay from." };


    if (currentAcc.balance < params.amount) {
      return {
        success: false,
        receiptNumber: "",
        error: `Insufficient balance to pay $${params.amount.toFixed(2)} USD. Current balance: $${currentAcc.balance.toFixed(2)} USD.`,
      };
    }

    const receipt = `REC-${Date.now().toString().slice(-8)}`;
    const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newTxn: Transaction = {
      id: txnId,
      userId: activeUserId,
      userName: `${user.firstName} ${user.lastName}`,
      date: now,
      type: "Bill Payment",
      description: `${params.category}: ${params.provider} (Acct: ${params.accountNumber})`,
      recipientOrSender: params.provider,
      amount: -params.amount,
      currency: "USD",
      status: "Successful",
      targetAccount: "Current Account",
      reference: receipt,
    };

    setManagedUsers((prev) =>
      prev.map((u) => {
        if (u.id !== activeUserId) return u;
        return {
          ...u,
          accounts: u.accounts.map((acc) => {
            if (acc.type !== "Current Account") return acc;
            const updated = Number((acc.balance - params.amount).toFixed(2));
            return {
              ...acc,
              balance: updated,
              availableBalance: updated,
            };
          }),
        };
      })
    );

    setTransactions((prev) => [newTxn, ...prev]);

    return { success: true, receiptNumber: receipt };
  };

  const convertCurrency = (amount: number, from: string, to: string) => {
    const fromRate = EXCHANGE_RATES[from] || 1.0;
    const toRate = EXCHANGE_RATES[to] || 1.0;
    const inUSD = amount / fromRate;
    const converted = inUSD * toRate;
    const rate = toRate / fromRate;
    const fee = 0.0;
    return { converted, rate, fee };
  };

  const addBeneficiary = (ben: Omit<Beneficiary, "id">) => {
    const newBen: Beneficiary = { ...ben, id: `ben-${Date.now()}` };
    setBeneficiaries((prev) => [newBen, ...prev]);
  };

  const removeBeneficiary = (id: string) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <BankingContext.Provider
      value={{
        user,
        accounts,
        totalBalance,
        isMasked,
        toggleMask,
        card,
        transactions,
        beneficiaries,
        notifications,
        managedUsers,
        clearAllUsers,
        switchActiveUser,
        registerNewUser,
        adminApproveUser,
        adminDeclineUser,
        adminCreditUser,
        adminDebitUser,
        adminApproveTransaction,
        adminDeclineTransaction,
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
        formatCurrency: (amount: number, currency = "USD") =>
          new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(amount) || 0),
      }}
    >
      {children}
    </BankingContext.Provider>
  );
}

export function useBanking() {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error("useBanking must be used within a BankingProvider");
  }
  return context;
}
