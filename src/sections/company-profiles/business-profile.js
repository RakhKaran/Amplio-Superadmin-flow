import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  Divider,
  Stack,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';
import { useGetBusinessProfiles } from 'src/api/companyKyc';
import axiosInstance from 'src/utils/axios';
import Label from 'src/components/label';


const STATUS_DISPLAY = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

export default function BusinessProfileDetails({ companyProfile }) {
  const { enqueueSnackbar } = useSnackbar();

  const companyId = companyProfile?.data?.id;

  const { businessProfile = [], refreshProfiles } =
    useGetBusinessProfiles(companyId);

  // 🔑 Single business profile
  const profile = businessProfile?.[0];

  /* ------------------------------------------------------------------ */
  /* FORM SETUP */
  /* ------------------------------------------------------------------ */
  const methods = useForm({
    defaultValues: {
      yearInBusiness: '',
      turnover: '',
      projectedTurnover: '',
    },
  });

  const { reset } = methods;

  // Populate form once API data arrives
  useEffect(() => {
    if (!profile) return;

    reset({
      yearInBusiness: profile.yearInBusiness ?? '',
      turnover: profile.turnover ?? '',
      projectedTurnover: profile.projectedTurnover ?? '',
    });
  }, [profile, reset]);

  /* ------------------------------------------------------------------ */
  /* REJECT DIALOG STATE */
  /* ------------------------------------------------------------------ */
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedBusinessKycId, setSelectedBusinessKycId] = useState(null);

  const isFinalStatus = profile?.status === 1;

  const hasProfile = !!profile;



  const handleApprove = async (id) => {
    if (!id) return;

    try {
      await axiosInstance.patch(
        '/company-profiles/business-profile-verification',
        {
          id,
          status: 1,
          reason: '',
        }
      );

      enqueueSnackbar('Business profile approved', { variant: 'success' });
      refreshProfiles();
    } catch (error) {
      enqueueSnackbar('Approval failed', { variant: 'error' });
    }
  };

  const handleRejectClick = (id) => {
    setSelectedBusinessKycId(id);
    setRejectOpen(true);
  };


  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      enqueueSnackbar('Please enter a rejection reason', {
        variant: 'warning',
      });
      return;
    }

    try {
      await axiosInstance.patch(
        '/company-profiles/business-profile-verification',
        {
          id: selectedBusinessKycId,
          status: 2,
          reason: rejectReason,
        }
      );

      enqueueSnackbar('Business profile rejected', { variant: 'error' });
      setRejectOpen(false);
      setRejectReason('');
      refreshProfiles();
    } catch (error) {
      enqueueSnackbar('Rejection failed', { variant: 'error' });
    }
  };


  /* ------------------------------------------------------------------ */
  return (
    <Container>
      <Card sx={{ p: 3 }}>


        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
            Business Profile
          </Typography>

          {/* Status */}
          <Label
            color={STATUS_DISPLAY[profile?.status]?.color || 'default'}
            sx={{ px: 2, py: 1, borderRadius: 1 }}
          >
            {STATUS_DISPLAY[profile?.status]?.label || 'Unknown'}
          </Label>
        </Stack>
        <FormProvider methods={methods}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2.5,
            }}
          >
            <RHFTextField
              name="yearInBusiness"
              label="Year in Business"
              disabled
            />

            <RHFTextField
              name="turnover"
              label="Turnover (FY24 Audited)"
              disabled
            />

            <RHFTextField
              name="projectedTurnover"
              label="Projected Turnover (FY25)"
              disabled
            />
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ACTIONS — SAME PATTERN AS DOCUMENT VERIFICATION */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="soft"
              color="error"
             disabled={!hasProfile || isFinalStatus}
              onClick={() =>
                handleRejectClick(profile?.id)
              }
            >
              Decline
            </Button>

            <Button
              variant="soft"
              color="success"
             disabled={!hasProfile || isFinalStatus}
              onClick={() =>
                handleApprove(profile?.id)
              }
              sx={{
                opacity: isFinalStatus ? 0.4 : 1,
                cursor: isFinalStatus ? 'not-allowed' : 'pointer',
              }}
            >
              Approve
            </Button>
          </Stack>
        </FormProvider>
      </Card>

      {/* REJECT DIALOG */}
      <RejectReasonDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />
    </Container>
  );
}
