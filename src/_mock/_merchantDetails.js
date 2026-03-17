import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const MERCHANT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'under_review', label: 'Under Review', color: 'info' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

export const _merchantDetailsList = [...Array(20)].map((_, index) => ({
  id: _mock.id(index),
  merchantName: _mock.companyName(index),
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
  // Bank Details
  bankAccounts: [
    {
      id: '1',
      bankName: 'HDFC Bank',
      branchName: 'Andheri West',
      ifscCode: 'HDFC0001234',
      accountNumber: '50100012345678',
      bankAccountProofType: 0,
      isPrimary: true,
      status: 1,
      bankAccountProof: { fileUrl: '#' },
    },
    {
      id: '2',
      bankName: 'ICICI Bank',
      branchName: 'Bandra East',
      ifscCode: 'ICIC0005678',
      accountNumber: '000405001234',
      bankAccountProofType: 1,
      isPrimary: false,
      status: 0,
      bankAccountProof: { fileUrl: '#' },
    },
  ],
  // PSP Details
  psps: [
    {
      id: '1',
      psp: 'Razorpay',
      merchantId: 'rzp_live_8FJ3kL9dE2',
      settlementAccount: 'XXXX1234',
      apiKey: 'rzp_test_key_123456',
      apiSecret: 'rzp_secret_abcdef',
      status: 'active',
    },
    {
      id: '2',
      psp: 'Cashfree',
      merchantId: 'cf_live_92kslK2',
      settlementAccount: 'XXXX5678',
      apiKey: 'cf_api_key_987654',
      apiSecret: 'cf_secret_123abc',
      status: 'pending',
    },
  ],
  // Receivables Data (EcommerceYearlySales format)
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
  // Settlement Data
  settlements: [
    { id: '1', date: '2023-10-01', amount: 5000, status: 'Completed', psp: 'Razorpay', utr: 'UTR123456' },
    { id: '2', date: '2023-10-02', amount: 7500, status: 'Pending', psp: 'Cashfree', utr: '-' },
    { id: '3', date: '2023-10-03', amount: 12000, status: 'Completed', psp: 'Razorpay', utr: 'UTR789012' },
  ],
  // Documents
  documents: [
    { id: '1', name: 'GST Certificate', label: 'GST Certificate', status: 1, fileUrl: 'https://example.com/gst.pdf' },
    { id: '2', name: 'PAN Card', label: 'PAN Card', status: 1, fileUrl: 'https://example.com/pan.pdf' },
    { id: '3', name: 'Incorporation Certificate', label: 'Incorporation Certificate', status: 0, fileUrl: 'https://example.com/inc.pdf' },
  ],
  // Audit Trail
  auditTrail: [
    { id: '1', action: 'KYC Approved', user: 'Admin', date: '2023-10-01 10:00 AM' },
    { id: '2', action: 'Document Uploaded', user: 'Merchant', date: '2023-09-28 02:30 PM' },
    { id: '3', action: 'Profile Created', user: 'System', date: '2023-09-25 09:15 AM' },
  ],
}));
