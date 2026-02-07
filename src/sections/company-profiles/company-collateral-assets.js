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

import FormProvider, {
  RHFTextField,
  RHFCustomFileUploadBox,
} from 'src/components/hook-form';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';
import { useGetCollateralAssets } from 'src/api/companyKyc';
import axiosInstance from 'src/utils/axios';
import { CollateralAssetForm } from './collateral-assets-form';

export default function CollateralAssetsDetails({ companyProfile }) {
  const { enqueueSnackbar } = useSnackbar();
  const companyId = companyProfile?.data?.id;

  const { collateralAssets = [], refreshCollateralAssets } =
    useGetCollateralAssets(companyId);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectAssetId, setRejectAssetId] = useState(null);

  const handleApprove = async (id) => {
    try {
      await axiosInstance.patch(
        '/company-profiles/collateral-assets-verification',
        { id, status: 1, reason: '' }
      );
      enqueueSnackbar('Collateral asset approved', { variant: 'success' });
      refreshCollateralAssets();
    } catch {
      enqueueSnackbar('Approval failed', { variant: 'error' });
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason || !rejectAssetId) return;

    await axiosInstance.patch(
      '/company-profiles/collateral-assets-verification',
      { id: rejectAssetId, status: 2, reason: rejectReason }
    );

    enqueueSnackbar('Collateral asset rejected', { variant: 'success' });
    setRejectOpen(false);
    setRejectReason('');
    setRejectAssetId(null);
    refreshCollateralAssets();
  };

  return (
    <Container>

      <Card sx={{ p: 3, mt: 3, maxHeight: '70vh', overflowY: 'auto' }}>
           <Typography variant="h5" mb={2} fontWeight={700}>
          Collateral Assets Verification
        </Typography>
        {collateralAssets.map((asset, index) => (
          <CollateralAssetForm
            key={asset.id}
            asset={asset}
            index={index}
            onApprove={handleApprove}
            onReject={(id) => {
              setRejectAssetId(id);
              setRejectOpen(true);
            }}
          />
        ))}
      </Card>

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

