import React, { useMemo } from 'react';
import { CircularProgress, Box, Stack, Typography, Grid, Card } from '@mui/material';
import { paths } from 'src/routes/paths';

import InvestorBankCard from './investor-bank-cards';
import { useGetBankDetails } from 'src/api/investorKyc';

export default function InvestorBankPage({ investorProfile }) {
  const userId = investorProfile?.data?.id;
  const listHref = userId
    ? `${paths.dashboard.investorProfiles.details(userId)}?tab=bank`
    : paths.dashboard.investorProfiles.list;
  const { bankDetails, loading } = useGetBankDetails(userId);
  const bankList = useMemo(() => {
    if (Array.isArray(bankDetails)) return bankDetails;
    if (!bankDetails) return [];
    return [bankDetails];
  }, [bankDetails]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Investor Bank Details
        </Typography>
      </Stack>

      {bankList.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No bank details added yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bankList.map((item, index) => (
            <Grid key={item?.id || index} item xs={12} md={6}>
              <InvestorBankCard
                bank={item}
                listHref={listHref}
                onViewRow={() => undefined}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Card>
  );
}
