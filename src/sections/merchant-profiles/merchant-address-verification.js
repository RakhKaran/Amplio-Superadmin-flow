import { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Typography,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
import { useForm, useWatch } from 'react-hook-form';
import axiosInstance from 'src/utils/axios';
import Label from 'src/components/label';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';
import FormProvider, {
  RHFCustomFileUploadBox,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';
import { useGetBusinessAddressDetails } from 'src/api/merchant-kyc';

const STATUS_MAP = {
  0: { label: 'Pending', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

function getAddressProof(address) {
  return (
    address?.addressProof ||
    address?.addressProofFile ||
    address?.document ||
    address?.media ||
    null
  );
}

function getOverallStatus(registeredAddress, correspondenceAddress) {
  const statuses = [registeredAddress?.status, correspondenceAddress?.status].filter(
    (status) => typeof status === 'number'
  );

  if (!statuses.length) return 0;
  if (statuses.includes(2)) return 2;
  if (statuses.every((status) => status === 1)) return 1;
  return 0;
}

export default function MerchantAddressVerification({ merchantProfile }) {
  const merchantId = merchantProfile?.data?.id;
  const { registeredAddress, correspondenceAddress, loading, refreshAddressDetails } =
    useGetBusinessAddressDetails(merchantId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const defaultValues = useMemo(
    () => ({
      documentType: registeredAddress?.documentType || 'electricity_bill',
      registeredAddressLine1: registeredAddress?.addressLineOne || '',
      registeredAddressLine2: registeredAddress?.addressLineTwo || '',
      registeredCountry: registeredAddress?.country || 'India',
      registeredCity: registeredAddress?.city || '',
      registeredState: registeredAddress?.state || '',
      registeredPincode: registeredAddress?.pincode || '',
      sameAsRegistered:
        !!registeredAddress &&
        !!correspondenceAddress &&
        registeredAddress.addressLineOne === correspondenceAddress.addressLineOne &&
        registeredAddress.city === correspondenceAddress.city &&
        registeredAddress.state === correspondenceAddress.state &&
        registeredAddress.pincode === correspondenceAddress.pincode,
      correspondenceAddressLine1: correspondenceAddress?.addressLineOne || '',
      correspondenceAddressLine2: correspondenceAddress?.addressLineTwo || '',
      correspondenceCountry: correspondenceAddress?.country || 'India',
      correspondenceCity: correspondenceAddress?.city || '',
      correspondenceState: correspondenceAddress?.state || '',
      correspondencePincode: correspondenceAddress?.pincode || '',
      addressProof: getAddressProof(registeredAddress),
    }),
    [registeredAddress, correspondenceAddress]
  );

  const methods = useForm({ defaultValues });
  const { reset, watch } = methods;
  const sameAsRegistered = watch('sameAsRegistered');
  const documentType = useWatch({ control: methods.control, name: 'documentType' });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const status = useMemo(
    () => getOverallStatus(registeredAddress, correspondenceAddress),
    [registeredAddress, correspondenceAddress]
  );
  const isFinalStatus = status === 1 || status === 2;

  const submitVerification = async (nextStatus, reason = '') => {
    try {
      setIsSubmitting(true);

      const response = await axiosInstance.patch(
        '/merchant-profiles/address-verification',
        {
          merchantId,
          status: nextStatus,
          reason,
        }
      );

      enqueueSnackbar(response?.data?.message || 'Address verification updated', {
        variant: 'success',
      });
      refreshAddressDetails();
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Address verification failed', {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = () => submitVerification(1, '');

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      enqueueSnackbar('Please enter a rejection reason', { variant: 'warning' });
      return;
    }

    await submitVerification(2, rejectReason.trim());
    setRejectOpen(false);
    setRejectReason('');
  };

  return (
    <Container>
      <Card sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Address Details Verification
            </Typography>
            <Label variant="soft" color={STATUS_MAP[status]?.color || 'default'}>
              {STATUS_MAP[status]?.label || 'Pending'}
            </Label>
          </Stack>

          <FormProvider methods={methods}>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <Typography variant="h6">Upload Address Proof</Typography>
                <Box sx={{ width: 260 }}>
                  <RHFSelect name="documentType" label="Document Type" disabled>
                    <MenuItem value="electricity_bill">Electricity Bill</MenuItem>
                    <MenuItem value="lease_agreement">Lease Agreement</MenuItem>
                  </RHFSelect>
                </Box>

                <RHFCustomFileUploadBox
                  name="addressProof"
                  label={`Upload ${
                    (documentType === 'electricity_bill' && 'Electricity Bill') ||
                    (documentType === 'lease_agreement' && 'Lease Agreement')
                  }`}
                  icon="mdi:file-document-outline"
                  disabled
                />
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" sx={{ mb: 2 }}>
                    Registered Address
                  </Typography>

                  <Stack spacing={2}>
                    <RHFTextField name="registeredAddressLine1" label="Address Line 1" disabled />
                    <RHFTextField name="registeredAddressLine2" label="Address Line 2" disabled />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <RHFTextField name="registeredCountry" label="Country" disabled />
                      <RHFTextField name="registeredCity" label="City" disabled />
                      <RHFTextField name="registeredState" label="State" disabled />
                    </Box>
                    <RHFTextField name="registeredPincode" label="Pincode" disabled />
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5">Correspondence Address</Typography>
                    <FormControlLabel
                      control={<Checkbox checked={sameAsRegistered} disabled />}
                      label="Same as Registered"
                    />
                  </Box>

                  <Stack spacing={2} sx={{ opacity: sameAsRegistered ? 0.5 : 1 }}>
                    <RHFTextField
                      name="correspondenceAddressLine1"
                      label="Address Line 1"
                      disabled
                    />
                    <RHFTextField
                      name="correspondenceAddressLine2"
                      label="Address Line 2"
                      disabled
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <RHFTextField name="correspondenceCountry" label="Country" disabled />
                      <RHFTextField name="correspondenceCity" label="City" disabled />
                      <RHFTextField name="correspondenceState" label="State" disabled />
                    </Box>
                    <RHFTextField name="correspondencePincode" label="Pincode" disabled />
                  </Stack>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                <Button
                  variant="soft"
                  color="error"
                  onClick={() => setRejectOpen(true)}
                  disabled={loading || isSubmitting || isFinalStatus}
                >
                  Reject
                </Button>

                <LoadingButton
                  variant="soft"
                  color="success"
                  onClick={handleApprove}
                  loading={isSubmitting}
                  disabled={loading || isFinalStatus}
                >
                  Approve
                </LoadingButton>
              </Box>
            </Stack>
          </FormProvider>
        </Stack>
      </Card>

      <RejectReasonDialog
        title="Reject Address Details"
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />
    </Container>
  );
}

MerchantAddressVerification.propTypes = {
  merchantProfile: PropTypes.object,
};
