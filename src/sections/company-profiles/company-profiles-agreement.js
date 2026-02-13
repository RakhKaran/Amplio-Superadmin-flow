import { LoadingButton } from '@mui/lab';
import { Card, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import axiosInstance from 'src/utils/axios';
import AgreementDetailsListView from './view/agreement-details-list-view';
import { useGetAgreementDetails } from 'src/api/companyKyc';

export default function PendingVerificationForm({ companyProfiles }) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const companyId = companyProfiles?.data?.id;

  const { agreementDetails = [] , refreshAgreementDetails } =
    useGetAgreementDetails(companyId);

  const hasAgreements = Array.isArray(agreementDetails) && agreementDetails.length > 0;

  const handleFetchAgreement = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.patch(
        `/company-profiles/${companyId}/pending-verification`
      );

      enqueueSnackbar(res.data.message || 'Moved to Agreement', {
        variant: 'success',
      });
      refreshAgreementDetails();
    } catch (error) {
      enqueueSnackbar(
        error?.error?.message || 'Verification failed',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <Stack spacing={2}>

        {hasAgreements ? (
          <AgreementDetailsListView
            companyProfile={agreementDetails}
          />
        ) : (
          <>
            <Typography variant="h6">Verification</Typography>

            <Typography variant="body2" color="text.secondary">
              This will verify Business Profile, Audited Financials,
              Collateral, and Guarantor details.
              If everything is approved, the application will move to
              <b> Agreement</b>.
            </Typography>

            <Stack alignItems="flex-end">
              <LoadingButton
                size="small"
                variant="soft"
                color="success"
                loading={loading}
                onClick={handleFetchAgreement}
                sx={{ px: 3 }}
              >
                Generate Agreement
              </LoadingButton>
            </Stack>
          </>
        )}
      </Stack>
  );
}
