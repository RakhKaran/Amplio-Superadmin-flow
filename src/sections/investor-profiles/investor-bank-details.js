// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

// components
import { paths } from 'src/routes/paths';
import FormProvider, { RHFTextField, RHFSelect } from 'src/components/hook-form';
import { useForm, useWatch } from 'react-hook-form';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'src/routes/hook';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { useEffect, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useLocation } from 'react-router';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import DocumentPreviewButton from 'src/components/custom-preview-button/preview-button';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

export default function InvestorBankDetails({ bank: bankProp, onBack, listHref: listHrefProp }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const router = useRouter();
  const { state } = useLocation();
  const bank = state?.bankData || bankProp || null;
  const listHref = state?.listHref || listHrefProp || paths.dashboard.investorProfiles.list;

  const NewSchema = Yup.object().shape({
    documentType: Yup.string().required('Document Type is required'),
    addressProof: Yup.mixed().required('Address proof is required'),
    bankName: Yup.string().required('Bank Name is required'),
    branchName: Yup.string().required('Branch Name is required'),
    accountNumber: Yup.number().required('Account Number is required'),
    ifscCode: Yup.string().required('IFSC Code is required'),
    accountType: Yup.string().required('Account Type is required'),
    accountHolderName: Yup.string().required('Account Holder Name is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewSchema),
    reValidateMode: 'onChange',
    defaultValues: {
      documentType: 'cheque',
      bankName: '',
      branchName: '',
      accountNumber: '',
      ifscCode: '',
      accountType: 'CURRENT',
      addressProof: null,
      accountHolderName: '',
      bankAddress: '',
      bankShortCode: '',
    },
  });

  const {
    handleSubmit,
    getValues,
    reset,
    control,
  } = methods;

  const documentType = useWatch({ control, name: 'documentType' });

  const existingProof = useMemo(
    () =>
      bank?.bankAccountProof
        ? {
            id: bank.bankAccountProof.id,
            name: bank.bankAccountProof.fileOriginalName,
            url: bank.bankAccountProof.fileUrl,
            status: bank.status === 1 ? 'approved' : 'pending',
            isServerFile: true,
          }
        : null,
    [bank]
  );

  useEffect(() => {
    if (bank) {
      reset({
        documentType: bank.bankAccountProofType === 0 ? 'cheque' : 'bank_statement',
        bankName: bank.bankName || '',
        branchName: bank.branchName || '',
        accountNumber: bank.accountNumber || '',
        ifscCode: bank.ifscCode || '',
        accountType: bank.accountType === 1 ? 'CURRENT' : 'SAVINGS',
        addressProof: null,
        accountHolderName: bank.accountHolderName || '',
        bankAddress: bank.bankAddress || '',
        bankShortCode: bank.bankShortCode || '',
      });
    }
  }, [bank, reset]);

  const handleCloseForm = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  const handleApprove = async () => {
    try {
      await axiosInstance.patch('/investor-profiles/bank-account-verification', {
        status: 1,
        accountId: bank?.id,
        reason: '',
      });

      enqueueSnackbar('Bank approved successfully!', { variant: 'success' });
      handleCloseForm();
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
      await axiosInstance.patch('/investor-profiles/bank-account-verification', {
        status: 2,
        accountId: bank?.id,
        reason: rejectReason,
      });

      enqueueSnackbar('Bank rejected', { variant: 'success' });
      setRejectOpen(false);
      setRejectReason('');
      handleCloseForm();
    } catch (err) {
      enqueueSnackbar('Rejection failed', { variant: 'error' });
    }
  };

  const onSubmit = handleSubmit(async () => {});

  return (
    <Box>
      <CustomBreadcrumbs
        heading="Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Investor Profile', href: listHref || paths.dashboard.investorProfiles.list },
          { name: 'Bank Details', href: listHref },
          { name: bank?.bankName || 'Preview' },
        ]}
        sx={{ mb: { xs: 3, md: 4 } }}
      />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Card
          sx={{
            width: '100%',
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            boxShadow: '0px 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Investor Bank Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review submitted investor bank details and verify the uploaded proof.
            </Typography>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Select Document Type:
          </Typography>

          <Box sx={{ width: { xs: '100%', sm: 240 }, mb: 3 }}>
            <RHFSelect
              name="documentType"
              disabled
              SelectProps={{
                displayEmpty: true,
              }}
            >
              <MenuItem value="cheque">Cheque</MenuItem>
              <MenuItem value="bank_statement">Bank Statement</MenuItem>
            </RHFSelect>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              gap={2}
              sx={{ mb: 1 }}
            >
              <Typography sx={{ fontWeight: 600 }}>
                Uploaded {documentType === 'cheque' ? 'Cheque' : 'Bank Statement'}:
              </Typography>
              <DocumentPreviewButton
                fileName={`Preview ${documentType === 'cheque' ? 'Cheque' : 'Bank Statement'}`}
                fileUrl={existingProof?.url}
                errorMessage="File not found"
                buttonText="Preview Document"
              />
            </Stack>
          </Box>

          <Box sx={{ py: 2 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <RHFTextField
                    name="ifscCode"
                    label="IFSC Code"
                    placeholder="Enter IFSC Code"
                    disabled
                  />
                  <RHFTextField
                    name="bankName"
                    label="Bank Name"
                    placeholder="Enter Bank Name"
                    disabled
                  />
                  <RHFTextField
                    name="branchName"
                    label="Branch Name"
                    placeholder="Enter Branch Name"
                    disabled
                  />
                  <RHFTextField
                    name="accountHolderName"
                    label="Account Holder Name"
                    placeholder="Enter Account Holder Name"
                    disabled
                  />
                  <RHFTextField
                    name="accountNumber"
                    label="Account Number"
                    placeholder="Enter Account Number"
                    disabled
                  />
                  <RHFTextField
                    name="bankAddress"
                    label="Bank Address"
                    placeholder="Bank Address"
                    disabled
                    InputLabelProps={{
                      shrink: Boolean(getValues('bankAddress')),
                    }}
                  />
                </Box>
              </Grid>

              <Grid xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <RHFSelect name="accountType" label="Account Type" disabled>
                    <MenuItem value="SAVINGS">Savings</MenuItem>
                    <MenuItem value="CURRENT">Current</MenuItem>
                  </RHFSelect>
                  <RHFTextField
                    name="bankShortCode"
                    label="Bank Short Code"
                    placeholder="Bank Short Code"
                    disabled
                    InputLabelProps={{
                      shrink: Boolean(getValues('bankShortCode')),
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              variant="soft"
              color="error"
              onClick={() => setRejectOpen(true)}
              disabled={bank?.status === 1 || bank?.status === 2}
              sx={{
                opacity: bank?.status === 1 || bank?.status === 2 ? 0.4 : 1,
              }}
            >
              Reject
            </Button>

            <Button
              variant="soft"
              color="success"
              onClick={handleApprove}
              disabled={bank?.status === 1 || bank?.status === 2}
              sx={{
                opacity: bank?.status === 1 || bank?.status === 2 ? 0.4 : 1,
              }}
            >
              Approve
            </Button>
          </Box>

          <RejectReasonDialog
            open={rejectOpen}
            onClose={() => setRejectOpen(false)}
            reason={rejectReason}
            setReason={setRejectReason}
            onSubmit={handleRejectSubmit}
          />
        </Card>
      </FormProvider>
    </Box>
  );
}

InvestorBankDetails.propTypes = {
  bank: PropTypes.object,
  listHref: PropTypes.string,
  onBack: PropTypes.func,
};
