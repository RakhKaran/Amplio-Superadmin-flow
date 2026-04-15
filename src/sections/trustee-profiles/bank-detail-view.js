import React, { useState } from 'react';
import { CircularProgress, Box, Button, Stack, Typography, Grid, Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { paths } from 'src/routes/paths';
import { useGetBankDetails, useGetDetails } from 'src/api/trusteeKyc';
import KYCBankDetails from './kyc-bank-details';
import BankDetailsCard from './trustee-bank-cards';

export default function TrusteeBankPage({ trusteeProfile }) {
  const navigate = useNavigate();

  const userId = trusteeProfile?.id;
  const listHref = userId
    ? `${paths.dashboard.trusteeProfiles.details(userId)}?tab=bank`
    : paths.dashboard.trusteeProfiles.list;
  const stepperId = trusteeProfile?.kycApplications?.currentProgress?.[2];

  // 🔥 Using your existing hook (no new API request)
  // const { rawData, Loading } = useGetDetails(userId, stepperId);

  const {bankDetails, loading} =useGetBankDetails(userId);

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
    <Card sx={{p:4}}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Trustee Bank Details
        </Typography>
{/* 
        <Button variant="contained" onClick={() => navigate(paths.dashboard.trusteeProfiles.new)}>
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
              <BankDetailsCard
                bank={item}
                listHref={listHref}
                onViewRow={() => handleViewRow(item)}
              />
            </Grid>
          ))}
        </Grid>
      )}
      {selectedBank && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Bank Details Preview
          </Typography>

          <KYCBankDetails
            trusteeProfile={{
              usersId: userId,
            }}
            listHref={listHref}
          />
        </Box>
      )}
    </Card>
  );
}
