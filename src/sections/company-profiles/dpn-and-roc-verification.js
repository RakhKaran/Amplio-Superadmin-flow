import { LoadingButton } from '@mui/lab';
import { Box, Card, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import axiosInstance from 'src/utils/axios';
import AgreementDetailsListView from './view/agreement-details-list-view';
import { useGetAgreementDetails, useGetDpnDetails, useGetRocDetails } from 'src/api/companyKyc';
import RocDetailsListView from './view/roc-details-list-view';
import DpnDetailsListView from './view/dpn-details-list-view';



export default function DpnAndRocPendingVerification({ companyProfiles }) {
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const [isBusinessKycComplete, setIsBusinessKycComplete] = useState(false);


    const companyId = companyProfiles?.data?.id;

    const { dpnDetails } = useGetDpnDetails(companyId);

    const {rocDetails} = useGetRocDetails(companyId);

    const safeDpnData = dpnDetails
        ? Array.isArray(dpnDetails)
            ? dpnDetails
            : [dpnDetails]
        : [];


    const handleApprovedKyc = async () => {
        try {
            setLoading(true);

            const res = await axiosInstance.patch(
                `/company-profiles/${companyId}/final-kyc-verification`
            );

            enqueueSnackbar(res.data.message || 'Kyc Approved Successfully', {
                variant: 'success',
            });

            if (res?.data?.isBusinessKycComplete) {
                setIsBusinessKycComplete(true);
            }

        } catch (error) {
            enqueueSnackbar(
                error?.response?.data?.message || 'Verification failed',
                { variant: 'error' }
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack spacing={2}>
            <Box px={3} pt={3}>
                <Typography variant="h6">Roc Details</Typography>
            </Box>
            <RocDetailsListView companyProfile={rocDetails} />
            <Box px={3} pt={3}>
                <Typography variant="h6">Dpn Details</Typography>
            </Box>
            <DpnDetailsListView companyProfile={safeDpnData} />
            <Box px={3} py={2}>
                <Stack direction="row" justifyContent="flex-end">
                    <LoadingButton
                        variant="soft"
                        color="success"
                        loading={loading}
                        disabled={isBusinessKycComplete}
                        onClick={handleApprovedKyc}
                    >
                        Approve KYC
                    </LoadingButton>
                </Stack>
            </Box>
        </Stack>
    );
}
