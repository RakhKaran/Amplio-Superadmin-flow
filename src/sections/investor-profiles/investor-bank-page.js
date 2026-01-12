import React, { useState } from 'react';
import { CircularProgress, Box, Button, Stack, Typography, Grid, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import InvestorBankCard from './investor-bank-cards';
import InvestorBankDetails from './investor-bank-details';
import { useGetBankDetails } from 'src/api/investorKyc';

export default function InvestorBankPage({ investorProfile }) {
  const navigate = useNavigate();

  const userId = investorProfile?.data?.id;
  const stepperId = investorProfile?.kycApplications?.currentProgress?.[2];

  // 🔥 Using your existing hook (no new API request)
  // const { rawData, Loading } = useGetDetails(userId, stepperId);

  const { bankDetails, loading } = useGetBankDetails(userId);

  // API returns array → hook returns rawData.data
  // const bankList = rawData?.data || [];

  const [selectedBank, setSelectedBank] = useState(null);

  const handleViewRow = (bank) => {
    setSelectedBank(bank);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ p: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Investor Bank Details
        </Typography>
        {/* 
        <Button variant="contained" onClick={() => navigate(paths.dashboard.investorProfiles.new)}>
          + Create Bank Details
        </Button> */}
      </Stack>

      <Grid container spacing={3}>
        <Grid key={bankDetails?.id} item xs={12} md={6}>
          <InvestorBankCard bank={bankDetails} onViewRow={() => handleViewRow(bankDetails)} />
        </Grid>
      </Grid>
      {selectedBank && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Bank Details Preview
          </Typography>

          <InvestorBankDetails
            investorProfile={{
              usersId: userId,
            }}
          />
        </Box>
      )}
    </Card>
  );
}
