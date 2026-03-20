export const escrowAccounts = [
  {
    id: 1,
    bankName: "Yes Bank",
    psp: "SPV-1",
    balance: 85.3,
    inflow: 3.2,
    status: "active"
  },
  {
    id: 2,
    bankName: "HDFC Bank",
    psp: "SPV-2",
    balance: 42.1,
    inflow: 1.5,
    status: "active"
  },
  {
    id: 3,
    bankName: "ICICI Bank",
    psp: "SPV-3",
    balance: 67.8,
    inflow: 2.4,
    status: "active"
  },
  {
    id: 4,
    bankName: "Axis Bank",
    psp: "SPV-4",
    balance: 29.5,
    inflow: 0.8,
    status: "active"
  }
];

export const waterfallSteps = [
  { step: 1, name: "TDS", amount: 0.5, status: "completed" },
  { step: 2, name: "Platform Fee", amount: 1.2, status: "completed" },
  { step: 3, name: "Reserve", amount: 2.0, status: "completed" },
  { step: 4, name: "Investor Principal", amount: 5.5, status: "in-progress" },
  { step: 5, name: "Investor Yield", amount: 1.8, status: "pending" },
  { step: 6, name: "Merchant Payout", amount: 12.5, status: "pending" }
];

export const settlementMismatches = [
  {
    id: "MIS-001",
    merchant: "Galaxy Fuels",
    expected: 2.5,
    received: 2.3,
    difference: -0.2
  },
  {
    id: "MIS-002",
    merchant: "Tech Innovators",
    expected: 1.8,
    received: 1.8,
    difference: 0.0
  },
  {
    id: "MIS-003",
    merchant: "Urban Retail",
    expected: 3.2,
    received: 3.5,
    difference: 0.3
  },
  {
    id: "MIS-004",
    merchant: "Global Logistics",
    expected: 4.5,
    received: 4.1,
    difference: -0.4
  }
];
