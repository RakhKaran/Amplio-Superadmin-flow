import React, { useMemo } from 'react';
import { CircularProgress, Box, Stack, Typography, Grid, Card } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { usePathname, useRouter } from 'src/routes/hook';

import InvestorBankCard from './investor-bank-cards';
import InvestorBankDetails from './investor-bank-details';
import { useGetBankDetails } from 'src/api/investorKyc';

export default function InvestorBankPage({ investorProfile }) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchParams] = useSearchParams();
  const userId = investorProfile?.data?.id;
  const { bankDetails, loading } = useGetBankDetails(userId);
  const bankList = useMemo(() => {
    if (Array.isArray(bankDetails)) return bankDetails;
    if (!bankDetails) return [];
    return [bankDetails];
  }, [bankDetails]);

  const selectedBankId = searchParams.get('bankAccountId');
  const selectedBank = useMemo(
    () => bankList.find((item) => String(item?.id) === String(selectedBankId)) || null,
    [bankList, selectedBankId]
  );

  const handleViewRow = (bank) => {
    router.push(`${pathname}?tab=bank&bankAccountId=${bank?.id}`);
  };

  const handleBackToList = () => {
    router.push(`${pathname}?tab=bank`);
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
      {!selectedBank ? (
        <>
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
                  <InvestorBankCard bank={item} onViewRow={() => handleViewRow(item)} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      ) : (
        <InvestorBankDetails
          bank={selectedBank}
          onBack={handleBackToList}
          listHref={`${pathname}?tab=bank`}
        />
      )}
    </Card>
  );
}
