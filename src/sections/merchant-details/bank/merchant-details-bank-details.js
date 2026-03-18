import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
// components
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import Iconify from 'src/components/iconify';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';
import DocumentPreviewButton from 'src/components/custom-preview-button/preview-button';

// ----------------------------------------------------------------------

export default function MerchantDetailsBankDetails({ bank, onBack, refreshBankDetails }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const NewSchema = Yup.object().shape({
    documentType: Yup.string().required('Document Type is required'),
    bankName: Yup.string().required('Bank Name is required'),
    branchName: Yup.string().required('Branch Name is required'),
    accountNumber: Yup.string().required('Account Number is required'),
    ifscCode: Yup.string().required('IFSC Code is required'),
    accountType: Yup.string().required('Account Type is required'),
    accountHolderName: Yup.string().required('Account Holder Name is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewSchema),
    defaultValues: {
      documentType: 'cheque',
      bankName: '',
      branchName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: 'CURRENT',
      accountHolderName: '',
      bankAddress: '',
      bankShortCode: '',
    },
  });

  const {
    setValue,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const documentType = useWatch({ control, name: 'documentType' });

  useEffect(() => {
    if (bank) {
      reset({
        documentType: bank.bankAccountProofType === 0 ? 'cheque' : 'bank_statement',
        bankName: bank.bankName || '',
        branchName: bank.branchName || '',
        accountNumber: bank.accountNumber || '',
        ifscCode: bank.ifscCode || '',
        accountType: bank.accountType === 1 ? 'CURRENT' : 'SAVINGS',
        accountHolderName: bank.accountHolderName || '',
        bankAddress: bank.bankAddress || '',
        bankShortCode: bank.bankShortCode || '',
      });
    }
  }, [bank, reset]);

  const handleApprove = async () => {
    try {
      await axiosInstance.patch('/merchant-profiles/bank-account-verification', {
        status: 1,
        accountId: bank?.id,
        reason: '',
      });

      enqueueSnackbar('Bank Approved Successfully!', { variant: 'success' });
      refreshBankDetails();
      onBack();
    } catch (err) {
      enqueueSnackbar('Approval failed', { variant: 'error' });
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason) {
      enqueueSnackbar('Please enter a reason', { variant: 'warning' });
      return;
    }

    try {
      await axiosInstance.patch('/merchant-profiles/bank-account-verification', {
        status: 2,
        accountId: bank?.id,
        reason: rejectReason,
      });

      enqueueSnackbar('Bank Rejected', { variant: 'success' });
      setRejectOpen(false);
      setRejectReason('');
      refreshBankDetails();
      onBack();
    } catch (err) {
      enqueueSnackbar('Rejection failed', { variant: 'error' });
    }
  };

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

          <Box sx={{ width: 200, mb: 3 }}>
            <RHFSelect name="documentType" label="Document Type" disabled>
              <MenuItem value="cheque">Cheque</MenuItem>
              <MenuItem value="bank_statement">Bank Statement</MenuItem>
            </RHFSelect>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 4,
              p: 2,
              bgcolor: 'background.neutral',
              borderRadius: 1,
            }}
          >
            <Typography sx={{ fontWeight: 600 }}>
              Uploaded {documentType === 'cheque' ? 'Cheque' : 'Bank Statement'}:
            </Typography>
            <DocumentPreviewButton
              fileName={`preview_${documentType}`}
              fileUrl={bank?.bankAccountProof?.fileUrl}
              errorMessage="File not found"
              buttonText="Preview Document"
            />
          </Box>

          <Grid container spacing={3}>
            <Grid xs={12} md={9}>
              <Stack spacing={3}>
                <RHFTextField name="ifscCode" label="IFSC Code" disabled />
                <RHFTextField name="bankName" label="Bank Name" disabled />
                <RHFTextField name="branchName" label="Branch Name" disabled />
                <RHFTextField name="accountHolderName" label="Account Holder Name" disabled />
                <RHFTextField name="accountNumber" label="Account Number" disabled />
                <RHFTextField name="bankAddress" label="Bank Address" disabled multiline rows={2} />
              </Stack>
            </Grid>

            <Grid xs={12} md={3}>
              <Stack spacing={3}>
                <RHFSelect name="accountType" label="Account Type" disabled>
                  <MenuItem value="SAVINGS">Savings</MenuItem>
                  <MenuItem value="CURRENT">Current</MenuItem>
                </RHFSelect>
                <RHFTextField name="bankShortCode" label="Bank Short Code" disabled />
              </Stack>
            </Grid>
          </Grid>

          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button
              variant="soft"
              color="error"
              onClick={() => setRejectOpen(true)}
              disabled={bank?.status === 1 || bank?.status === 2}
            >
              Reject
            </Button>

            <Button
              variant="soft"
              color="success"
              onClick={handleApprove}
              disabled={bank?.status === 1 || bank?.status === 2}
            >
              Approve
            </Button>
          </Box> */}
        </Card>
      </FormProvider>

      <RejectReasonDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />
    </Box>
  );
}

MerchantDetailsBankDetails.propTypes = {
  bank: PropTypes.object,
  onBack: PropTypes.func,
  refreshBankDetails: PropTypes.func,
};
