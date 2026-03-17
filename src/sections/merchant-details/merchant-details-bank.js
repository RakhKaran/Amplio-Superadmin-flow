import PropTypes from 'prop-types';
import { useState } from 'react';
import { Typography, Grid, Box, CircularProgress } from '@mui/material';
import { useGetBankDetails } from 'src/api/merchant-kyc';
import MerchantDetailsBankCard from './merchant-details-bank-card';
import MerchantDetailsBankDetails from './merchant-details-bank-details';

// ----------------------------------------------------------------------

export default function MerchantDetailsBank({ merchant }) {
  const merchantId = merchant?.id;
  const { bankDetails = [], loading, refreshBankDetails } = useGetBankDetails(merchantId);

  const [selectedBank, setSelectedBank] = useState(null);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (selectedBank) {
    return (
      <MerchantDetailsBankDetails
        bank={selectedBank}
        onBack={() => setSelectedBank(null)}
        refreshBankDetails={refreshBankDetails}
      />
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Bank Accounts
      </Typography>

      {bankDetails.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No bank details added yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bankDetails.map((bank) => (
            <Grid item xs={12} md={6} key={bank.id}>
              <MerchantDetailsBankCard
                bank={bank}
                onOpenForm={(data) => setSelectedBank(data)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

MerchantDetailsBank.propTypes = {
  merchant: PropTypes.object,
};
