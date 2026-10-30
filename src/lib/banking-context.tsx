import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  UserProfile,
  BankAccount,
  DebitCardDetails,
  Transaction,
  Beneficiary,
  DEFAULT_USER,
  DEFAULT_DEBIT_CARD,
  DEFAULT_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_BENEFICIARIES,
  EXCHANGE_RATES,
} from "./banking-store";

interface BankingContextType {
  user: UserProfile;
  accounts: BankAccount[];
  totalBalance: number;
  isMasked: boolean; // default true (hidden financial details by default)
  toggleMask: () => void;
  card: DebitCardDetails;
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  notifications: Array<{ id: string; title: string; time: string; read: boolean }>;
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
  resetToDefault: () => void;
}

const BankingContext = createContext<BankingContextType | undefined>(undefined);

export function BankingProvider({ children }: { children: ReactNode }) {
  // 1. User profile state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("varenta_customer_user");
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // 2. Bank Accounts state - Initial total balance 0.00 as strictly required
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    try {
      const saved = localStorage.getItem("varenta_customer_accounts");
      return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  });

  // 3. Mask sensitive information: HIDDEN BY DEFAULT as requested
  const [isMasked, setIsMasked] = useState<boolean>(true);

  // 4. Debit Card State
  const [card, setCard] = useState<DebitCardDetails>(() => {
    try {
      const saved = localStorage.getItem("varenta_customer_card");
      return saved ? JSON.parse(saved) : DEFAULT_DEBIT_CARD;
    } catch {
      return DEFAULT_DEBIT_CARD;
    }
  });

  // 5. Transactions History
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem("varenta_customer_transactions");
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // 6. Beneficiaries
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    try {
      const saved = localStorage.getItem("varenta_customer_beneficiaries");
      return saved ? JSON.parse(saved) : INITIAL_BENEFICIARIES;
    } catch {
      return INITIAL_BENEFICIARIES;
    }
  });

  // 7. Notifications
  const [notifications, setNotifications] = useState([
    { id: "notif-1", title: "Welcome to Varenta Bank. Your multi-currency accounts are ready.", time: "Just now", read: false },
    { id: "notif-2", title: "World Elite Titanium debit card generated and secured with 360° CVV.", time: "1 hour ago", read: false },
    { id: "notif-3", title: "Security reminder: Biometric facial authorization active for transfers.", time: "1 day ago", read: true },
  ]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("varenta_customer_user", JSON.stringify(user));
    } catch { /* ignore */ }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("varenta_customer_accounts", JSON.stringify(accounts));
    } catch { /* ignore */ }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem("varenta_customer_card", JSON.stringify(card));
    } catch { /* ignore */ }
  }, [card]);

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

  // Calculate Total Balance
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  const toggleMask = () => setIsMasked((prev) => !prev);

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const toggleCardFreeze = () => {
    setCard((prev) => ({ ...prev, isFrozen: !prev.isFrozen }));
  };

  const updateCardLimit = (newLimit: number) => {
    setCard((prev) => ({ ...prev, dailyLimit: newLimit }));
  };

  // Deposit funds to account
  const depositFunds = async (
    amount: number,
    targetAccount: "Current Account" | "Savings Account",
    method: string
  ): Promise<{ success: boolean; txn: Transaction }> => {
    const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newTxn: Transaction = {
      id: txnId,
      date: now,
      type: "Deposit",
      description: `Inbound Capital Deposit via ${method}`,
      recipientOrSender: method,
      amount: amount,
      currency: "USD",
      status: "Successful",
      reference: `DEP-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.type === targetAccount
          ? {
              ...acc,
              balance: Number((acc.balance + amount).toFixed(2)),
              availableBalance: Number((acc.availableBalance + amount).toFixed(2)),
            }
          : acc
      )
    );

    setTransactions((prev) => [newTxn, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Account credited: +$${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${targetAccount})`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    return { success: true, txn: newTxn };
  };

  // Domestic Transfer
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
      date: now,
      type: "Domestic Transfer",
      description: params.description || `Transfer to ${params.recipientName}`,
      recipientOrSender: `${params.recipientName} (${params.bankName})`,
      amount: -params.amount,
      currency: "USD",
      status: "Successful",
      recipientBank: params.bankName,
      recipientAccount: params.accountNumber,
      reference: `DOM-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.type === "Current Account"
          ? {
              ...acc,
              balance: Number((acc.balance - params.amount).toFixed(2)),
              availableBalance: Number((acc.availableBalance - params.amount).toFixed(2)),
            }
          : acc
      )
    );

    setTransactions((prev) => [newTxn, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Domestic wire dispatched: -$${params.amount.toFixed(2)} to ${params.recipientName}`,
        time: "Just now",
        read: false,
      },
      ...prev,
    ]);

    return { success: true, txn: newTxn };
  };

  // International Transfer (EXCLUDING ALL AFRICAN COUNTRIES)
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
      date: now,
      type: "International Wire",
      description: `SWIFT/RTGS to ${params.recipientName} (${params.country})`,
      recipientOrSender: `${params.recipientName} (${params.bankName} - ${params.country})`,
      amount: -params.amount,
      currency: "USD",
      status: "Successful",
      reference: `INTL-${Math.floor(100000 + Math.random() * 900000)}`,
      recipientBank: `${params.bankName} [${params.swiftBic}]`,
      recipientAccount: params.iban,
      fee: params.fee,
    };

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.type === "Current Account"
          ? {
              ...acc,
              balance: Number((acc.balance - totalDeduction).toFixed(2)),
              availableBalance: Number((acc.availableBalance - totalDeduction).toFixed(2)),
            }
          : acc
      )
    );

    setTransactions((prev) => [newTxn, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `International Wire approved: -$${params.amount.toFixed(2)} USD (${params.convertedAmount.toFixed(2)} ${params.currency}) to ${params.recipientName}`,
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
      date: now,
      type: "Bill Payment",
      description: `${params.category}: ${params.provider} (Acct: ${params.accountNumber})`,
      recipientOrSender: params.provider,
      amount: -params.amount,
      currency: "USD",
      status: "Successful",
      reference: receipt,
    };

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.type === "Current Account"
          ? {
              ...acc,
              balance: Number((acc.balance - params.amount).toFixed(2)),
              availableBalance: Number((acc.availableBalance - params.amount).toFixed(2)),
            }
          : acc
      )
    );

    setTransactions((prev) => [newTxn, ...prev]);

    return { success: true, receiptNumber: receipt };
  };

  // Currency Converter calculation
  const convertCurrency = (amount: number, from: string, to: string) => {
    const fromRate = EXCHANGE_RATES[from] || 1.0;
    const toRate = EXCHANGE_RATES[to] || 1.0;
    // Base amount in USD
    const inUSD = amount / fromRate;
    const converted = inUSD * toRate;
    const rate = toRate / fromRate;
    const fee = 0.0; // 0% markup as advertised
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

  const resetToDefault = () => {
    setUser(DEFAULT_USER);
    setAccounts(DEFAULT_ACCOUNTS);
    setCard(DEFAULT_DEBIT_CARD);
    setTransactions(INITIAL_TRANSACTIONS);
    setBeneficiaries(INITIAL_BENEFICIARIES);
    localStorage.clear();
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
        resetToDefault,
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
