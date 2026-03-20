export const complianceSummary = [
    {
        id: 1,
        title: "Alerts Inbox",
        value: 24,
        icon: "solar:inbox-bold",
    },
    {
        id: 2,
        title: "Due Diligence Queue",
        value: 8,
        icon: "solar:info-circle-bold",
    },
    {
        id: 3,
        title: "STRs Filed (MTD)",
        value: 3,
        icon: "solar:check-circle-bold",
    },
];

export const screeningSummary = [
    {
        id: 1,
        title: "PEP Screening",
        checked: 2342,
        matches: 0,
        status: "Clear",
    },
    {
        id: 2,
        title: "Sanctions Check",
        checked: 2342,
        matches: 2,
        status: "Review",
    },
    {
        id: 3,
        title: "Adverse Media",
        checked: 2342,
        matches: 5,
        status: "Review",
    },
];

export const riskScoringTimeline = [
    {
        id: 1,
        name: "Rohan Petroleum",
        date: "2026-03-01",
        score: 15,
        risk: "Low",
    },
    {
        id: 2,
        name: "Galaxy Fuels",
        date: "2026-03-01",
        score: 42,
        risk: "Medium",
    },
    {
        id: 3,
        name: "Bharat Energy",
        date: "2026-02-28",
        score: 8,
        risk: "Low",
    },
];

export const amlAlertsData = [
    {
        id: 1,
        alertId: "AML-001",
        merchant: "Rohan Petroleum",
        type: "PEP Screening",
        priority: "High",
        status: "Under Review",
    },
    {
        id: 2,
        alertId: "AML-002",
        merchant: "Galaxy Fuels",
        type: "Transaction Monitoring",
        priority: "Medium",
        status: "In Progress",
    },
    {
        id: 3,
        alertId: "AML-003",
        merchant: "Bharat Energy",
        type: "Sanctions Check",
        priority: "Low",
        status: "Cleared",
    },
];