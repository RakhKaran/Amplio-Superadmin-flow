import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Grid2 from '@mui/material/Unstable_Grid2';
// components
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';

const STATUS = {
  Verified: { label: 'Approved', color: '#2E7D32', icon: 'mdi:check-decagram' },
  Pending: { label: 'Under Review', color: '#f8a15a', icon: 'mdi:clock-time-eight-outline' },
  Rejected: { label: 'Rejected', color: '#C62828', icon: 'mdi:close-circle' },
};

function maskAccountNumber(num) {
  if (!num) return '';
  const lastFour = num.slice(-4);
  return `**** **** **** ${lastFour}`;
}

function InvestorDetailsBankCard({ bank, onOpenForm }) {
  if (!bank) return null;

  return (
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
      onClick={() => onOpenForm(bank)}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={2} alignItems="center">
          <Iconify icon="mdi:bank" width={30} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Bank Name
            </Typography>
            <Typography variant="h6">{bank?.bankName}</Typography>
          </Box>
        </Stack>

        <Chip
          icon={<Iconify icon={STATUS[bank?.status]?.icon || 'mdi:help-circle'} />}
          label={STATUS[bank?.status]?.label || 'Unknown'}
          sx={{
            bgcolor: `${STATUS[bank?.status]?.color || '#9e9e9e'}1A`,
            color: STATUS[bank?.status]?.color || '#9e9e9e',
            fontWeight: 600,
            px: 1.5,
            pointerEvents: 'none',
            transition: 'none',
            cursor: 'default',
            '& .MuiChip-label, & .MuiChip-icon': {
              cursor: 'default',
            },
            '&:hover': {
              bgcolor: `${STATUS[bank?.status]?.color || '#9e9e9e'}1A`,
              color: STATUS[bank?.status]?.color || '#9e9e9e',
            },
          }}
        />
      </Stack>

      <Divider />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="mdi:home-city-outline" width={22} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Branch Name
              </Typography>
              <Typography variant="subtitle1">{bank?.branch || '-'}</Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="mdi:web" width={22} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                IFSC Code
              </Typography>
              <Typography variant="subtitle1">{bank?.ifscCode || '-'}</Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="mdi:card-account-details" width={22} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Account Number
              </Typography>
              <Typography variant="subtitle1">{maskAccountNumber(bank?.accountNumber)}</Typography>
            </Box>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Iconify icon="mdi:account-circle-outline" width={22} />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Account Holder
              </Typography>
              <Typography variant="subtitle1">{bank?.accountHolderName || '-'}</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

InvestorDetailsBankCard.propTypes = {
  bank: PropTypes.object,
  onOpenForm: PropTypes.func,
};

function InvestorDetailsBankPreview({ bank, onBack }) {
  const methods = useForm({
    defaultValues: {
      bankName: '',
      branchName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: '',
      accountHolderName: '',
      verifiedOn: '',
      verifiedBy: '',
    },
  });

  const { reset } = methods;

  useEffect(() => {
    if (bank) {
      reset({
        bankName: bank.bankName || '',
        branchName: bank.branch || '',
        accountNumber: bank.accountNumber || '',
        ifscCode: bank.ifscCode || '',
        accountType: bank.accountType || '',
        accountHolderName: bank.accountHolderName || '',
        verifiedOn: bank.verifiedOn || '',
        verifiedBy: bank.verifiedBy || '',
      });
    }
  }, [bank, reset]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Button
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          onClick={onBack}
          sx={{ fontWeight: 600 }}
        >
          Back to list
        </Button>
      </Stack>

      <FormProvider methods={methods}>
        <Card sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Bank Details Preview
          </Typography>

          <Grid2 container spacing={3}>
            <Grid2 xs={12} md={9}>
              <Stack spacing={3}>
                <RHFTextField name="ifscCode" label="IFSC Code" disabled />
                <RHFTextField name="bankName" label="Bank Name" disabled />
                <RHFTextField name="branchName" label="Branch Name" disabled />
                <RHFTextField name="accountHolderName" label="Account Holder Name" disabled />
                <RHFTextField name="accountNumber" label="Account Number" disabled />
                <RHFTextField name="verifiedBy" label="Verified By" disabled />
              </Stack>
            </Grid2>

            <Grid2 xs={12} md={3}>
              <Stack spacing={3}>
                <RHFSelect name="accountType" label="Account Type" disabled>
                  <MenuItem value="Savings Account">Savings Account</MenuItem>
                  <MenuItem value="Current Account">Current Account</MenuItem>
                </RHFSelect>
                <RHFTextField name="verifiedOn" label="Verified On" disabled />
              </Stack>
            </Grid2>
          </Grid2>
        </Card>
      </FormProvider>
    </Box>
  );
}

InvestorDetailsBankPreview.propTypes = {
  bank: PropTypes.object,
  onBack: PropTypes.func,
};

export default function InvestorBankDetails({ bank }) {
  const bankData = useMemo(() => {
    const primaryBank = bank?.primaryBankAccount;
    return primaryBank ? [{ ...primaryBank, id: 'primary-bank' }] : [];
  }, [bank]);

  const [selectedBank, setSelectedBank] = useState(null);

  if (selectedBank) {
    return <InvestorDetailsBankPreview bank={selectedBank} onBack={() => setSelectedBank(null)} />;
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Bank Accounts
      </Typography>

      {bankData.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          No bank details added yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {bankData.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <InvestorDetailsBankCard bank={item} onOpenForm={(data) => setSelectedBank(data)} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

InvestorBankDetails.propTypes = {
  bank: PropTypes.object,
};
