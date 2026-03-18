import PropTypes from 'prop-types';
import { Card, Box, Typography, Stack, Divider, Chip, Grid, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function InvestorBankDetails({ bank }) {
  const bankData = bank?.primaryBankAccount;

  if (!bankData) {
    return (
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="body1">No bank details available.</Typography>
      </Card>
    );
  }

  const STATUS = {
    'Verified': { label: 'Approved', color: '#2E7D32', icon: 'mdi:check-decagram' },
    'Pending': { label: 'Under Review', color: '#ED6C02', icon: 'mdi:clock-time-eight-outline' },
    'Rejected': { label: 'Rejected', color: '#C62828', icon: 'mdi:close-circle' },
  };

  const maskAccountNumber = (num) => {
    if (!num) return '';
    const lastFour = num.slice(-4);
    return `**** **** **** ${lastFour}`;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            cursor: 'pointer',
            transition: '0.2s',
            '&:hover': {
              transform: 'scale(1.01)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
            },
          }}
        >
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Iconify icon="mdi:bank" width={30} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Bank Name
                </Typography>
                <Typography variant="subtitle1" fontWeight={600}>
                  {bankData.bankName}
                </Typography>
              </Box>
            </Stack>

            <Chip
              icon={<Iconify icon={STATUS[bankData.status]?.icon || 'mdi:help-circle'} />}
              label={STATUS[bankData.status]?.label || bankData.status}
              sx={{
                bgcolor: `${STATUS[bankData.status]?.color || '#9e9e9e'}1A`,
                color: STATUS[bankData.status]?.color || '#9e9e9e',
                fontWeight: 600,
                px: 1.5,
              }}
            />
          </Stack>

          <Divider />

          {/* Details Grid */}
          <Grid container spacing={2}>
            {/* Account Holder */}
            <Grid item xs={12}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify icon="mdi:account-circle-outline" width={22} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Account Holder Name
                  </Typography>
                  <Typography variant="subtitle2">{bankData.accountHolderName}</Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Account Number */}
            <Grid item xs={12} sm={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify icon="mdi:card-account-details" width={22} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Account Number
                  </Typography>
                  <Typography variant="subtitle2">{maskAccountNumber(bankData.accountNumber)}</Typography>
                </Box>
              </Stack>
            </Grid>

            {/* IFSC Code */}
            <Grid item xs={12} sm={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify icon="mdi:web" width={22} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    IFSC Code
                  </Typography>
                  <Typography variant="subtitle2">{bankData.ifscCode}</Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Account Type */}
            <Grid item xs={12} sm={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify icon="mdi:label-outline" width={22} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Account Type
                  </Typography>
                  <Typography variant="subtitle2">{bankData.accountType}</Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Branch */}
            <Grid item xs={12} sm={6}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify icon="mdi:home-city-outline" width={22} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Branch
                  </Typography>
                  <Typography variant="subtitle2">{bankData.branch}</Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}

InvestorBankDetails.propTypes = {
  bank: PropTypes.object,
};
