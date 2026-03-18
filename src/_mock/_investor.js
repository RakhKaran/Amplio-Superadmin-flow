export const InvestorData = [
    {
        "id": "INV-001",
        "investorName": "Axis Mutual Fund",
        "category": "Institutional",
        "status": 0,
        "totalExposure": 250,
        "yields": 12.5,
        "lastFundDate": "2026-02-28",
        "pan": "AAACA1234B",
        "cin": "U74999MH2009PLC189758",
        "address": {
            "addressLine1": "Bandra Kurla Complex",
            "addressLine2": "Bandra East",
            "city": "Mumbai",
            "state": "Maharashtra",
            "pincode": "400051",
            "country": "India"
        },
        "signatories": [
            {
                "id": "SIG-001",
                "name": "John Doe",
                "designation": "Director",
                "email": "john.doe@axismf.com",
                "mobile": "+91 98765 43210",
                "status": "Verified"
            }
        ],
        "documents": [
            {
                "id": "DOC-001",
                "documents": { "name": "Certificate of Incorporation" },
                "documentsFile": { "fileUrl": "https://example.com/cert.pdf", "fileName": "cert.pdf" },
                "status": 1
            },
            {
                "id": "DOC-002",
                "documents": { "name": "PAN Card" },
                "documentsFile": { "fileUrl": "https://example.com/pan.pdf", "fileName": "pan.pdf" },
                "status": 1
            },
            {
                "id": "DOC-003",
                "documents": { "name": "Address Proof" },
                "documentsFile": { "fileUrl": "https://example.com/address.pdf", "fileName": "address.pdf" },
                "status": 0
            }
        ],
        "bankDetails": {
            "primaryBankAccount": {
                "bankName": "HDFC Bank Ltd.",
                "accountType": "Current Account",
                "accountNumber": "50200012345678",
                "ifscCode": "HDFC0001234",
                "branch": "Bandra Kurla Complex, Mumbai",
                "accountHolderName": "Axis Mutual Fund",
                "verifiedOn": "2024-12-16",
                "verifiedBy": "Finance Team",
                "status": "Verified"
            }
        },
        "investmentLimits": {
            "maximumExposure": 500,
            "currentExposure": 250,
            "available": 250
        },
        "walletEscrow": {
            "escrowAccount": {
                "accountName": "Smile Wave Escrow Account - Axis MF",
                "managedBy": "ICICI Bank",
                "status": "Active",
                "totalFunds": 250,
                "allocatedToPTC": 204.2,
                "availableFunds": 45.8,
                "escrowAccountNumber": "ESC9876543210",
                "escrowIFSC": "ICIC0ESCROW",
                "escrowBank": "ICICI Bank Ltd.",
                "setupDate": "2024-11-20"
            }
        },
        "ptcTransactions": [
            {
                id: "PTC-TXN-001",
                title: "PTC Allocation - Pending Approval",
                type: "allocation",
                status: "Pending",

                transactionId: "TXN-2026-00892",
                ptcSeries: "SW-D3-2025-C1",

                amount: 12,
                unit: "Cr",

                date: "2026-03-09 14:35:22",
                initiatedBy: "System Auto-Allocation",
            },

            {
                id: "PTC-TXN-002",
                title: "Investment in PTC Series A2",
                type: "investment",
                status: "Completed",

                transactionId: "TXN-2026-00891",
                ptcSeries: "SW-D1-2025-A2",

                amount: 20,
                unit: "Cr",

                date: "2026-03-05 11:20:15",
                initiatedBy: "Investment Team",
            },

            {
                id: "PTC-TXN-003",
                title: "Quarterly Interest Payout",
                type: "payout",
                status: "Completed",

                transactionId: "TXN-2026-00880",
                ptcSeries: "SW-D1-2025-A1",

                amount: 3.5,
                unit: "Cr",

                date: "2026-03-01 10:10:10",
                initiatedBy: "Finance Automation",
            }
        ],
        "transactions": [
            {
                "transactionId": "TXN-2026-00892",
                "type": "Investment in",
                "tType": "Escrow Account Deposit",
                "status": "Pending",
                "from": "HDFC Bank A/C ****5678",
                "to": "Escrow Account",
                "amount": 12,
                "reference": "HDFC2026022512345678",
                "date": "2026-03-09 14:35:22",
                "initiatedBy": "System Auto Allocation"
            },
            {
                "transactionId": "TXN-2026-00892",
                "type": "Interest Payout",
                "tType": "PTC Purchase - SW-D3-2025-C1",
                "status": "Pending",
                "from": "Escrow Account",
                "to": "Smile Wave SPV",
                "amount": 21,
                "reference": "ICIC2026030912345678",
                "date": "2026-03-09 14:35:22",
                "initiatedBy": "System Auto Allocation"
            },
            {
                "transactionId": "TXN-2026-00892",
                "type": "Allocation to ",
                "tType": "transactions",
                "status": "completed",
                "from": "Escrow Account",
                "to": "Smile Wave SPV",
                "amount": 10,
                "reference": "ICIC2026030912345678",
                "date": "2026-03-09 14:35:22",
                "initiatedBy": "System Auto Allocation"
            }
        ]
    },

    {
        "id": "INV-002",
        "investorName": "ICICI Prudential",
        "category": "Institutional",
        "status": 0,
        "totalExposure": 180,
        "yields": 11.8,
        "lastFundDate": "2026-02-27",
        "pan": "AAACI5678D",
        "cin": "U67120MH1993PLC071079",
        "documents": [
            { "documentName": "Certificate of Incorporation", "status": "Verified" },
            { "documentName": "PAN Card", "status": "Verified" },
            { "documentName": "Address Proof", "status": "Verified" }
        ],
        "bankDetails": {
            "primaryBankAccount": {
                "bankName": "ICICI Bank Ltd.",
                "accountType": "Current Account",
                "accountNumber": "62100098765432",
                "ifscCode": "ICIC0000456",
                "branch": "Nariman Point, Mumbai",
                "accountHolderName": "ICICI Prudential",
                "verifiedOn": "2024-11-12",
                "verifiedBy": "Finance Team",
                "status": "Verified"
            }
        },
        "investmentLimits": {
            "maximumExposure": 400,
            "currentExposure": 180,
            "available": 220
        },
        "walletEscrow": {
            "escrowAccount": {
                "accountName": "Smile Wave Escrow Account - ICICI",
                "managedBy": "ICICI Bank",
                "status": "Active",
                "totalFunds": 180,
                "allocatedToPTC": 150,
                "availableFunds": 30,
                "escrowAccountNumber": "ESC4567891230",
                "escrowIFSC": "ICIC0ESCROW",
                "escrowBank": "ICICI Bank Ltd.",
                "setupDate": "2024-10-10"
            }
        },
        "ptcAllocation": {
            "activePTCs": [
                { "ptcSeries": "SW-D3-2025-C1", "amount": 25, "yield": 11.5, "maturityDate": "2026-07-15" },
                { "ptcSeries": "SW-D3-2025-C2", "amount": 30, "yield": 12.0, "maturityDate": "2026-08-10" }
            ]
        },
        "transactions": [
            {
                "transactionId": "TXN-2026-00880",
                "type": "Investment",
                "status": "Completed",
                "from": "Escrow Account",
                "to": "Smile Wave SPV",
                "amount": 25,
                "reference": "ICIC2026022712345678",
                "date": "2026-02-27 10:10:10",
                "initiatedBy": "Investment Team"
            }
        ]
    },

    {
        "id": "INV-003",
        "investorName": "Suresh Raina",
        "category": "HNI",
        "status": 0,
        "totalExposure": 15,
        "yields": 13.2,
        "lastFundDate": "2026-02-25",
        "pan": "ABCDE1234F",
        "cin": null,
        "documents": [
            { "documentName": "PAN Card", "status": "Verified" },
            { "documentName": "Aadhar Card", "status": "Verified" },
            { "documentName": "Address Proof", "status": "Verified" }
        ],
        "bankDetails": {
            "primaryBankAccount": {
                "bankName": "HDFC Bank",
                "accountType": "Savings Account",
                "accountNumber": "50123456789012",
                "ifscCode": "HDFC0000678",
                "branch": "Lucknow",
                "accountHolderName": "Suresh Raina",
                "verifiedOn": "2025-01-05",
                "verifiedBy": "Finance Team",
                "status": "Verified"
            }
        },
        "investmentLimits": {
            "maximumExposure": 50,
            "currentExposure": 15,
            "available": 35
        },
        "walletEscrow": {
            "escrowAccount": {
                "accountName": "Smile Wave Escrow Account - HNI",
                "managedBy": "ICICI Bank",
                "status": "Active",
                "totalFunds": 15,
                "allocatedToPTC": 10,
                "availableFunds": 5,
                "escrowAccountNumber": "ESC6543219870",
                "escrowIFSC": "ICIC0ESCROW",
                "escrowBank": "ICICI Bank Ltd.",
                "setupDate": "2025-01-01"
            }
        },
        "ptcAllocation": {
            "activePTCs": [
                { "ptcSeries": "SW-D1-2025-A2", "amount": 5, "yield": 13.0, "maturityDate": "2026-03-15" }
            ]
        },
        "transactions": [
            {
                "transactionId": "TXN-2026-00750",
                "type": "Interest Payout",
                "status": "Completed",
                "from": "Escrow Account",
                "to": "HDFC Bank A/C ****9012",
                "amount": 1.2,
                "reference": "ICIC2026022512345678",
                "date": "2026-02-25 09:00:00",
                "initiatedBy": "Finance Automation"
            }
        ]
    }
]


export const SummeryData = [
    {
        title: 'Total Exposure',
        value: '₹250 Cr',
        icon: 'solar:wallet-bold',
    },
    {
        title: 'Average Yield',
        value: '12.5%',
        icon: 'solar:graph-up-bold',
    },
    {
        title: 'Active PTCs',
        value: 18,
        icon: 'solar:document-bold',
    },
    {
        title: 'Risk Rating',
        value: 'AAA',
        icon: 'solar:shield-check-bold',
    },
];