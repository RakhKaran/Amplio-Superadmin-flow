import React, { useState } from 'react';
import { CircularProgress, Box, Stack, Typography, Grid, Card } from '@mui/material';
import MerchantBankCard from '../merchant-bank-cards';
import MerchantBankDetails from '../merchant-bank-details';
import { useGetBankDetails } from 'src/api/merchant-kyc';

export default function MerchantBankPage({ merchantProfile }) {
  const userId = merchantProfile?.data?.id;

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
          Merchant Bank Details
        </Typography>
        {/* 
        <Button variant="contained" onClick={() => navigate(paths.dashboard.merchant.new)}>
          + Create Bank Details
        </Button> */}
      </Stack>

      {/* No Bank Found */}
      {bankDetails.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No bank details added yet. Click "Create Bank Details" to continue.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bankDetails.map((item) => (
            <Grid key={item.id} item xs={12} md={6}>
              <MerchantBankCard bank={item} onViewRow={() => handleViewRow(item)} />
            </Grid>
          ))}
        </Grid>
      )}
      {selectedBank && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Bank Details Preview
          </Typography>

          <MerchantBankDetails
            merchantProfile={{
              usersId: userId,
            }}
          />
        </Box>
      )}
    </Card>
  );
}
