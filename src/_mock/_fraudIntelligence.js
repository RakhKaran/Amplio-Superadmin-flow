export const summeryData = [
  {
    id: 1,
    title: "Active Alerts",
    value: 12,
    icon: 'solar:danger-triangle-bold',
  },
  {
    id: 2,
    title: "Fraud Cases (MTD)",
    value: 8,
    icon: 'solar:close-circle-bold',
  },
  {
    id: 3,
    title: "Amount Blocked",
    value: "₹2.3 Cr",
    icon: 'solar:document-bold',
  }
];


export const farudHeatmap = [
  {
    id: 1,
    state: "Maharashtra",
    cases: "3 cases this month",
    status: "Medium"
  },
  {
    id: 2,
    state: "Karnataka",
    cases: "1 cases this month",
    status: "Low"
  },
  {
    id: 3,
    state: "Gujarat",
    cases: "5 cases this month",
    status: "High"
  },
  {
    id: 4,
    state: "Tamil Nadu",
    cases: "2 cases this month",
    status: "Medium"
  }
];

export const networkAnalysisData = {
  id: 1,
  title: "Network Analysis",
  linkedEntities: 15,
  description: "Linked entities detected",
};

export const fraudAlertsData = [
  {
    id: 1,
    alertId: "FRD-001",
    merchant: "Galaxy Fuels",
    reason: "Unusual refund spike",
    riskScore: 78,
    status: "Under Review",
    actions: ["Escalate", "Review"],
  },
  {
    id: 2,
    alertId: "FRD-002",
    merchant: "Premier Oil",
    reason: "Multiple failed transactions",
    riskScore: 65,
    status: "Investigating",
    actions: ["Escalate", "Review"],
  },
  {
    id: 3,
    alertId: "FRD-003",
    merchant: "Sunrise Petroleum",
    reason: "Velocity check failed",
    riskScore: 52,
    status: "Resolved",
    actions: ["Escalate", "Review"],
  }
];