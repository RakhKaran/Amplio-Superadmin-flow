import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const MERCHANT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'under_review', label: 'Under Review', color: 'info' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

export const _merchantDetailsList = [...Array(20)].map((_, index) => {
  const summaryDashboard = {
    riskTier: (index % 3 === 0 && 'Low') || (index % 3 === 1 && 'Medium') || 'High',
    exposureUsage: Math.floor(Math.random() * 100),
    totalReceivables: 115000000 + (index * 1000000),
    activePsps: (index % 3) + 1,
  };

  return {
    id: _mock.id(index),
    merchantName: _mock.companyName(index),
    companyName: _mock.companyName(index),
    email: _mock.email(index),
    phone: _mock.phoneNumber(index),
    CIN: `U${Math.floor(Math.random() * 90000) + 10000}MH${Math.floor(Math.random() * 9000) + 1000}PTC${Math.floor(Math.random() * 900000) + 100000}`,
    GSTIN: `${Math.floor(Math.random() * 90) + 10}AAAAA${Math.floor(Math.random() * 9000) + 1000}A${Math.floor(Math.random() * 9)}Z${Math.floor(Math.random() * 9)}`,
    status: (index % 4 === 0 && 'pending') || (index % 4 === 1 && 'under_review') || (index % 4 === 2 && 'approved') || 'rejected',
    createdAt: _mock.time(index),
    dateOfIncorporation: _mock.time(index),
    cityOfIncorporation: 'Mumbai',
    stateOfIncorporation: 'Maharashtra',
    countryOfIncorporation: 'India',
    udyamRegistrationNumber: `UDYAM-MH-${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000000) + 1000000}`,
    panCard: {
      extractedPanNumber: 'ABCDE1234F',
      submittedPanNumber: 'ABCDE1234F',
      extractedMerchantName: _mock.companyName(index),
      submittedMerchantName: _mock.companyName(index),
      media: {
        fileUrl: 'https://api-dev-minimal-v510.vercel.app/assets/images/cover/cover_1.jpg',
        fileType: 'image/jpeg',
      },
    },
    liquidity: {
      autoLiquidity: true,
      utilization: 32,
      creditLimit: 50,
      used: 16,
      available: 34,
      haircut: [
        { label: 'D0', value: 5 },
        { label: 'D1', value: 8 },
        { label: 'D2', value: 12 }
      ]
    },
    risk: {
      timeline: [
        { month: 'Jan', value: 8 },
        { month: 'Feb', value: 12 },
        { month: 'Mar', value: 10 }
      ],
      factors: [
        { label: 'Payment Behavior', value: 92, status: 'Good', color: 'info' },
        { label: 'Refund Rate', value: 98, status: 'Excellent', color: 'success' },
        { label: 'Settlement Timeliness', value: 95, status: 'Good', color: 'success' },
        { label: 'Transaction Volume', value: 88, status: 'Fair', color: 'warning' }
      ]
    },
    fraudAML: {
      aml: [
        { label: 'PEP Match', status: 'Clear', color: 'success' },
        { label: 'Sanctions Score', status: 'No Match', color: 'success' },
        { label: 'UBO Risk', status: 'Low', color: 'success' }
      ],
      alerts: []
    },
    receivablesSummary: {
      total: 120,
      pending: 30,
      upcoming: 50
    },
    receivables: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        {
          year: '2023',
          data: [
            { name: 'Total Revenue', data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49] },
            { name: 'Total Sales', data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77] },
          ],
        },
        {
          year: '2024',
          data: [
            { name: 'Total Revenue', data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49] },
            { name: 'Total Sales', data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77] },
          ],
        },
      ],
    },
    auditTrail: [
      {
        id: '1',
        timestamp: 'Mar 1, 2026 10:30 AM',
        admin: 'admin@smilewave.com',
        action: 'Updated Risk Tier',
        changes: 'Medium to Low',
      },
      {
        id: '2',
        timestamp: 'Mar 2, 2026 11:45 AM',
        admin: 'manager@smilewave.com',
        action: 'Approved PSP',
        changes: 'Pending to Approved',
      }
    ],
    settlements: {
      summary: {
        totalSettled: 4.5,
        deductions: 0.32,
        netAmount: 4.18,
        pending: 1.8
      },
      list: [
        {
          id: 'STL-2026-001',
          date: 'Mar 9, 2026',
          status: 'Completed',
          netSettlement: 21.5,
          grossAmount: 23.5,
          d0Haircut: -58.75,
          d1Haircut: -117.5,
          processingFee: -23.5,
          sourceAccount: 'Razorpay Pool Account',
          sourceRef: 'RAZR0000123456789',
          destinationAccount: 'Merchant Registered Account',
          destinationRef: 'YESB000001234567890',
          transferInitiated: '09:30:00',
          creditReceived: '09:35:22',
          utr: 'RAZR2026030900123',
          transactions: 2
        },
        {
          id: 'STL-2026-002',
          date: 'Mar 10, 2026',
          status: 'Pending',
          netSettlement: 15.0,
          grossAmount: 16.5,
          d0Haircut: -41.25,
          d1Haircut: -82.5,
          processingFee: -16.5,
          sourceAccount: 'Razorpay Pool Account',
          sourceRef: 'RAZR0000123456790',
          destinationAccount: 'Merchant Registered Account',
          destinationRef: 'YESB000001234567891',
          transferInitiated: '10:30:00',
          creditReceived: '-',
          utr: '-',
          transactions: 5
        }
      ]
    },
    receivable: {
      distribution: [
        { label: 'D0', value: 2.5 },
        { label: 'D1', value: 5.8 },
        { label: 'D2', value: 3.2 }
      ],
      recentTransactions: [
        {
          id: 'TXN123456',
          type: 'UPI',
          date: 'Mar 1, 2026',
          amount: 2.5,
          status: 'Assigned'
        },
        {
          id: 'TXN123457',
          type: 'NEFT',
          date: 'Mar 1, 2026',
          amount: 1.8,
          status: 'Pending'
        },
        {
          id: 'TXN123458',
          type: 'UPI',
          date: 'Feb 29, 2026',
          amount: 3.2,
          status: 'Assigned'
        }
      ]
    },
    summaryDashboard,
    summaryDashboardCards: [
      {
        title: 'Risk Tier',
        value: summaryDashboard.riskTier,
        icon: 'solar:shield-check-bold',
      },
      {
        title: 'Exposure Usage',
        value: `${summaryDashboard.exposureUsage}%`,
        icon: 'solar:graph-up-bold',
      },
      {
        title: 'Total Receivables',
        value: `INR ${(summaryDashboard.totalReceivables / 10000000).toFixed(1)} Cr`,
        icon: 'solar:wallet-money-bold',
      },
      {
        title: 'Active PSPs',
        value: summaryDashboard.activePsps,
        icon: 'solar:card-bold',
      },
    ],
  };
});
