export const summeryData = [
  {
    id: 1,
    title: "Rules Active",
    value: 47,
    icon: 'solar:shield-check-bold',
  },
  {
    id: 2,
    title: "AI Models Running",
    value: 8,
    icon: 'solar:pulse-bold',
  },
  {
    id: 3,
    title: "Triggers (Today)",
    value: 12,
    icon: 'solar:danger-circle-bold',
  }
];

export const riskTrendData = [
  { month: 'Jan', value: 2.6 },
  { month: 'Feb', value: 2.85 },
  { month: 'Mar', value: 2.2 }
];

export const aiModelPerformanceData = [
  {
    id: 1,
    label: 'Default Prediction Model',
    value: 94.5,
    status: 'Running',
    color: 'success'
  },
  {
    id: 2,
    label: 'Delay Probability Model',
    value: 91.2,
    status: 'Running',
    color: 'success'
  },
  {
    id: 3,
    label: 'Fraud Detection Model',
    value: 96.8,
    status: 'Running',
    color: 'success'
  }
];

export const activeRules = [
  {
    id: 1,
    title: 'High Refund Rate Alert',
    trigger: 'Refund rate > 5%',
    status: 'active',
    lastUpdated: '2 days ago',
  },
  {
    id: 2,
    title: 'Settlement Delay Warning',
    trigger: 'Settlement delay > 24h',
    status: 'active',
    lastUpdated: '5 days ago',
  },
  {
    id: 3,
    title: 'Exposure Limit Breach',
    trigger: 'Exposure > 85%',
    status: 'active',
    lastUpdated: '1 week ago',
  },
  {
    id: 4,
    title: 'PSP Downtime Alert',
    trigger: 'PSP uptime < 95%',
    status: 'active',
    lastUpdated: 'Never',
  },
];