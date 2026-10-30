// Varenta Bank Central State & Store
export interface UserProfile {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  gender: string;
  nationality: string;
  country: string;
  address: string;
  occupation: string;
  email: string;
  phone: string;
  accountType: "Current Account" | "Savings Account";
  preferredCurrency: string;
  accountNumber: string;
  status: "Active" | "Pending KYC" | "Verified";
  profilePic?: string;
  tier: "World Elite" | "Platinum" | "Private Client";
}

export interface BankAccount {
  accountNumber: string;
  type: "Current Account" | "Savings Account";
  balance: number;
  currency: string;
  availableBalance: number;
}

export interface DebitCardDetails {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  isFrozen: boolean;
  dailyLimit: number;
  contactlessEnabled: boolean;
  onlinePaymentsEnabled: boolean;
  cardType: "World Elite Titanium" | "Black Metal";
}

export interface Transaction {
  id: string;
  date: string;
  type: "Domestic Transfer" | "International Wire" | "Bill Payment" | "Deposit" | "Card Spend";
  description: string;
  recipientOrSender: string;
  amount: number;
  currency: string;
  status: "Successful" | "Pending" | "Failed" | "Reversed";
  reference?: string;
  recipientBank?: string;
  recipientAccount?: string;
  fee?: number;
}

export interface BillPaymentItem {
  id: string;
  category: "Electricity" | "Water" | "Internet" | "Cable TV" | "Airtime" | "Data Bundles" | "Utilities";
  provider: string;
  accountNumber: string;
  amount: number;
  date: string;
  receiptNumber: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  bankName: string;
  accountNumber: string;
  swiftBic?: string;
  country: string;
  currency: string;
  type: "domestic" | "international";
}

// Initial mock customer profile with $0.00 initial balance as requested
export const DEFAULT_USER: UserProfile = {
  firstName: "Alexander",
  middleName: "V.",
  lastName: "Varenta",
  dob: "1988-06-14",
  gender: "Male",
  nationality: "Swiss / American",
  country: "Switzerland",
  address: "Bahnhofstrasse 45, 8001 Zurich",
  occupation: "Senior Managing Director",
  email: "alexander.varenta@client.varentabank.com",
  phone: "+41 44 218 5000",
  accountType: "Current Account",
  preferredCurrency: "USD",
  accountNumber: "VB-8842-9102-77",
  status: "Active",
  tier: "World Elite",
  profilePic: "",
};

export const DEFAULT_DEBIT_CARD: DebitCardDetails = {
  cardNumber: "4920 8821 7392 8842",
  cardholderName: "ALEXANDER VARENTA",
  expiryDate: "11/31",
  cvv: "849",
  isFrozen: false,
  dailyLimit: 25000,
  contactlessEnabled: true,
  onlinePaymentsEnabled: true,
  cardType: "World Elite Titanium",
};

// Initial starting balances strictly $0.00 as required
export const DEFAULT_ACCOUNTS: BankAccount[] = [
  {
    accountNumber: "VB-8842-9102-01",
    type: "Current Account",
    balance: 0.0,
    currency: "USD",
    availableBalance: 0.0,
  },
  {
    accountNumber: "VB-8842-9102-02",
    type: "Savings Account",
    balance: 0.0,
    currency: "USD",
    availableBalance: 0.0,
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-89410921",
    date: "2026-10-30 05:45",
    type: "Deposit",
    description: "Initial Account Allocation (Pending Clearing)",
    recipientOrSender: "Treasury Deposit Sweep",
    amount: 0.0,
    currency: "USD",
    status: "Successful",
    reference: "DEP-INIT-001",
  },
];

export const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: "ben-1",
    name: "Geneva Asset Management SA",
    bankName: "Pictet & Cie",
    accountNumber: "CH93 0089 3000 1234 5678 9",
    swiftBic: "PICTCHGGXXX",
    country: "Switzerland",
    currency: "CHF",
    type: "international",
  },
  {
    id: "ben-2",
    name: "Lumen Capital Partners NY",
    bankName: "JPMorgan Chase Bank, N.A.",
    accountNumber: "021000021-9988112",
    country: "United States",
    currency: "USD",
    type: "domestic",
  },
  {
    id: "ben-3",
    name: "London Real Estate Holdings Ltd",
    bankName: "Barclays Bank UK PLC",
    accountNumber: "20-00-00 98765432",
    swiftBic: "BARCGB22XXX",
    country: "United Kingdom",
    currency: "GBP",
    type: "international",
  },
];

// Eligible International Transfer Countries (STRICTLY EXCLUDING ALL AFRICAN COUNTRIES)
export const ELIGIBLE_INTERNATIONAL_COUNTRIES = [
  { code: "US", name: "United States", currency: "USD", swiftCode: "CHASUS33" },
  { code: "GB", name: "United Kingdom", currency: "GBP", swiftCode: "BARCGB22" },
  { code: "CH", name: "Switzerland", currency: "CHF", swiftCode: "UBSWCHZH" },
  { code: "DE", name: "Germany", currency: "EUR", swiftCode: "DEUTDEDD" },
  { code: "FR", name: "France", currency: "EUR", swiftCode: "BNPAFRPP" },
  { code: "SG", name: "Singapore", currency: "SGD", swiftCode: "DBSSSGSG" },
  { code: "JP", name: "Japan", currency: "JPY", swiftCode: "BOTKJPJT" },
  { code: "AE", name: "United Arab Emirates", currency: "AED", swiftCode: "ENBDsite" },
  { code: "CA", name: "Canada", currency: "CAD", swiftCode: "ROYCCAT2" },
  { code: "AU", name: "Australia", currency: "AUD", swiftCode: "CTBAAU2S" },
  { code: "HK", name: "Hong Kong", currency: "HKD", swiftCode: "HSBCHKHH" },
  { code: "NL", name: "Netherlands", currency: "EUR", swiftCode: "INGBNL2A" },
  { code: "LU", name: "Luxembourg", currency: "EUR", swiftCode: "BGLLLULL" },
  { code: "SE", name: "Sweden", currency: "SEK", swiftCode: "HANDSESS" },
  { code: "NO", name: "Norway", currency: "NOK", swiftCode: "DNBANOKK" },
  { code: "IE", name: "Ireland", currency: "EUR", swiftCode: "BOFIIE2D" },
  { code: "NZ", name: "New Zealand", currency: "NZD", swiftCode: "ANZBNZ22" },
  { code: "KR", name: "South Korea", currency: "KRW", swiftCode: "KOEXKRSE" },
  { code: "ES", name: "Spain", currency: "EUR", swiftCode: "BBVAESMM" },
  { code: "IT", name: "Italy", currency: "EUR", swiftCode: "UNCRITM1" },
  { code: "BR", name: "Brazil", currency: "BRL", swiftCode: "ITAUBRSP" },
];

// Utility bill providers
export const BILL_PROVIDERS = {
  Electricity: [
    { id: "el-1", name: "Consolidated Edison (ConEd)" },
    { id: "el-2", name: "Pacific Gas & Electric (PG&E)" },
    { id: "el-3", name: "National Grid Power" },
    { id: "el-4", name: "EDF International" },
  ],
  Water: [
    { id: "wa-1", name: "Municipal Water Board" },
    { id: "wa-2", name: "American Water Works" },
    { id: "wa-3", name: "Thames Water Utility" },
  ],
  Internet: [
    { id: "in-1", name: "Verizon Fios Fiber" },
    { id: "in-2", name: "AT&T High Speed Fiber" },
    { id: "in-3", name: "Starlink Global Satellite" },
    { id: "in-4", name: "Swisscom Ultra Fiber" },
  ],
  "Cable TV": [
    { id: "tv-1", name: "Xfinity / Comcast Ultra" },
    { id: "tv-2", name: "Spectrum Digital" },
    { id: "tv-3", name: "Sky Q International" },
  ],
  Airtime: [
    { id: "at-1", name: "AT&T Wireless Instant" },
    { id: "at-2", name: "T-Mobile Premier" },
    { id: "at-3", name: "Vodafone Global" },
    { id: "at-4", name: "Swisscom Mobile" },
  ],
  "Data Bundles": [
    { id: "db-1", name: "Global Roaming 50GB Pass" },
    { id: "db-2", name: "Unlimited Enterprise 5G" },
    { id: "db-3", name: "Satellite eSIM Ultra Pack" },
  ],
  Utilities: [
    { id: "ut-1", name: "Metropolitan Gas & Heating" },
    { id: "ut-2", name: "City Municipal Services" },
    { id: "ut-3", name: "Clean Energy District Heating" },
  ],
};

// Live Currency Exchange Rates (Base USD)
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.924,
  GBP: 0.771,
  CHF: 0.865,
  CAD: 1.385,
  AUD: 1.518,
  JPY: 152.4,
  SGD: 1.319,
  AED: 3.673,
  HKD: 7.776,
  SEK: 10.65,
  NOK: 10.98,
  NZD: 1.674,
  KRW: 1378.0,
  BRL: 5.72,
};
