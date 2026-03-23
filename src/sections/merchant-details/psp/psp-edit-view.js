import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { useSnackbar } from 'src/components/snackbar';
import axiosInstance from 'src/utils/axios';
import { useEffect, useState } from 'react';
import { useGetPsp } from 'src/api/psp-master';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';
import { Stack } from '@mui/material';

export default function PSPIntegrationForm({
  open,
  onClose,
  currentPSP,
  isEditMode,
  isViewMode,
  approvalMode,
  refreshPspDetails,
  onSubmitSuccess,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const isFinalStatus = currentPSP?.status === 1;
  const { psp = [], pspsLoading } = useGetPsp();

  const PSPValidationSchema = Yup.object().shape({
    pspMasterId: Yup.string().required('PSP is required'),
  });

  const defaultValues = {
    pspMasterId: '',
  };

  const methods = useForm({
    resolver: yupResolver(PSPValidationSchema),
    defaultValues,
  });

  const {
    // handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const selectedPspId = watch('pspMasterId') || currentPSP?.pspMasterId;

  const selectedPsp = psp?.find((p) => p.id === selectedPspId);

  const fields = selectedPsp?.pspMasterFields || [];
  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (currentPSP && psp.length) {
      const resetData = {
        pspMasterId: currentPSP.pspMasterId,
      };

      const pspMaster = psp.find((p) => p.id === currentPSP.pspMasterId);

      if (pspMaster?.pspMasterFields) {
        pspMaster.pspMasterFields.forEach((field) => {
          resetData[field.fieldName] = currentPSP[field.fieldName] || '';
        });
      }

      reset(resetData);
    }
    if (!currentPSP) {
      reset({
        pspMasterId: '',
      });
    }
  }, [currentPSP, psp, reset]);

  const handleApprove = async () => {
    try {
      await axiosInstance.patch('/merchant-profiles/psp-verification', {
        pspId: currentPSP.id,
        status: 1,
        reason: '',
      });

      enqueueSnackbar('PSP approved successfully', { variant: 'success' });

      refreshPspDetails?.();
      onClose();
    } catch (error) {
      enqueueSnackbar('Failed to approve PSP', { variant: 'error' });
    }
  };

  const handleRejectSubmit = async () => {
    try {
      await axiosInstance.patch('/merchant-profiles/psp-verification', {
        pspId: currentPSP.id,
        status: 2,
        reason: rejectReason,
      });

      enqueueSnackbar('PSP rejected', { variant: 'error' });

      refreshPspDetails?.();
      setRejectOpen(false);
      onClose();
    } catch (error) {
      enqueueSnackbar('Failed to reject PSP', { variant: 'error' });
    }
  };

  // const onSubmit = handleSubmit(async (data) => {
  //   try {
  //     const usersId = sessionStorage.getItem('merchant_user_id');

  //     if (!usersId) {
  //       enqueueSnackbar('User ID missing. Restart KYC.', { variant: 'error' });
  //       return;
  //     }

  //     const pspDetail = {
  //       pspMasterId: data.pspMasterId,
  //     };

  //     sortedFields.forEach((field) => {
  //       pspDetail[field.fieldName] = data[field.fieldName];
  //     });

  //     let res;

  //     if (!isEditMode) {
  //       res = await axiosInstance.post('/merchant-profiles/kyc-psp', {
  //         usersId,
  //         psp: pspDetail,
  //       });
  //     } else {
  //       res = await axiosInstance.patch('/merchant-profiles/kyc-psp', {
  //         usersId,
  //         pspId: currentPSP.id,
  //         psp: pspDetail,
  //       });
  //     }

  //     if (res?.data?.success) {
  //       enqueueSnackbar(isEditMode ? 'PSP updated successfully' : 'PSP added successfully', {
  //         variant: 'success',
  //       });
  //       onClose();
  //       reset();
  //       if (onSubmitSuccess) {
  //         onSubmitSuccess(); // refresh parent list instantly
  //       }
  //     } else {
  //       enqueueSnackbar(res?.data?.message || 'Something went wrong', {
  //         variant: 'error',
  //       });
  //     }
  //   } catch (error) {
  //     enqueueSnackbar(error?.error?.message, { variant: 'error' });
  //   }
  // });

  return (
    <>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
        <FormProvider methods={methods}>
          <DialogTitle>PSP Verification</DialogTitle>

          <DialogContent>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Configure your payment service provider integration. Your request will be reviewed and
              approved by our team.
            </Typography>

            <Box display="grid" rowGap={3}>
              <RHFSelect name="pspMasterId" label="Select PSP *" disabled>
                <MenuItem value="" disabled>
                  Choose a payment service provider
                </MenuItem>

                {psp?.map((psps) => (
                  <MenuItem key={psps.id} value={psps.id}>
                    {psps.name}
                  </MenuItem>
                ))}
              </RHFSelect>

              {/* <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }} gap={2}> */}
              {sortedFields.map((field) => (
                <RHFTextField
                  key={field.id}
                  name={field.fieldName}
                  label={`${field.label}${field.isRequired ? ' *' : ''}`}
                  type={field.type === 'password' ? 'password' : 'text'}
                  disabled
                />
              ))}
              {/* </Box> */}

              <Alert severity="warning" sx={{mb: 2}}>
                <strong>Review Process</strong>
                <br />
                Your integration request will be reviewed by our operations team within 24 hours.
                You&#39;ll be notified once approved.
              </Alert>
            </Box>
          </DialogContent>
          {/* <Box sx={{ my: 3 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="soft"
                color="error"
                disabled={isFinalStatus}
                onClick={() => setRejectOpen(true)}
              >
                Decline
              </Button>

              <Button
                variant="soft"
                color="success"
                disabled={isFinalStatus}
                onClick={handleApprove}
              >
                Approve
              </Button>
            </Stack>
          </Box> */}
        </FormProvider>
      </Dialog>
      <RejectReasonDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />
    </>
  );
}

PSPIntegrationForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  currentPSP: PropTypes.object,
  isEditMode: PropTypes.bool,
  onSubmitSuccess: PropTypes.func,
};
