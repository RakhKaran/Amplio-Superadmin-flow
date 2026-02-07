import { LoadingButton } from '@mui/lab';
import { Card, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import axiosInstance from 'src/utils/axios';

export default function PendingVerificationForm({ companyProfiles }) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);


    const companyId = companyProfiles?.data?.id

    const handleFetchAgreement = async () => {
        try {
            setLoading(true);

            const res = await axiosInstance.patch(
                `/company-profiles/${companyId}/pending-verification`
            );

            enqueueSnackbar(res.data.message || 'Moved to Agreement', {
                variant: 'success',
            });

            setIsCompleted(true);

        } catch (error) {
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error?.message ||
                'Verification failed';

            enqueueSnackbar(message, { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h6">
                    Final Verification
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    This will verify Business Profile, Audited Financials,
                    Collateral, and Guarantor details.
                    If everything is approved, the application will move to
                    <b> Agreement</b>.
                </Typography>

                <Stack alignItems="center">
                    <LoadingButton
                        size="small"
                        variant="soft"
                        color="success"
                        disabled={isCompleted}
                        loading={loading}
                        onClick={handleFetchAgreement}
                        sx={{ px: 3 }} 
                    >
                        Fetch Agreement
                    </LoadingButton>
                </Stack>
            </Stack>
        </Card>
    );
}
