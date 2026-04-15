import { useState } from 'react';
import { Box, Button, Card, Divider, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { useGetFinancialsDetails } from 'src/api/companyKyc';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';
import axiosInstance from 'src/utils/axios';

import FinancialDetailsForm from '../financial-details-form';
import AuditedFinancial from '../audited-financial';
import BorrowingDetails from '../borrowing-details';
import CapitalDetails from '../capital-details';
import ProfitabilityDetails from '../profitable-details';
import FundPosition from '../fund-position';

export default function AllFinancialDetailsView({ companyProfile }) {
  const { enqueueSnackbar } = useSnackbar();

  const companyProfilesId = companyProfile?.data?.id;
  const { financialDetails, refreshFinancialsDetails } = useGetFinancialsDetails(companyProfilesId);

  const financialDetailsList = Array.isArray(financialDetails)
    ? financialDetails
    : financialDetails
      ? [financialDetails]
      : [];

  const hasData = financialDetailsList.length > 0;
  const allApproved =
    financialDetailsList.length > 0 && financialDetailsList.every((item) => item?.status === 1);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApproveAll = async () => {
    await axiosInstance.patch('/company-profiles/financial-details-verification', {
      companyProfilesId,
      status: 1,
      reason: '',
    });

    enqueueSnackbar('Financial details approved', { variant: 'success' });
    refreshFinancialsDetails();
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return;

    await axiosInstance.patch('/company-profiles/financial-details-verification', {
      companyProfilesId,
      status: 2,
      reason: rejectReason,
    });

    enqueueSnackbar('Financial details rejected', { variant: 'error' });
    setRejectOpen(false);
    setRejectReason('');
    refreshFinancialsDetails();
  };

  return (
    <>
      <Stack spacing={3}>
        {!hasData ? (
          <Card sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">
              No financial details found.
            </Typography>
          </Card>
        ) : (
          financialDetailsList.map((financial, index) => (
            <Stack spacing={4}>
              <AuditedFinancial financial={financial} />
              <BorrowingDetails financial={financial} />
              <CapitalDetails financial={financial} />
              <ProfitabilityDetails financial={financial} />
              <FundPosition financial={financial} />
              <FinancialDetailsForm financial={financial} />
            </Stack>
          ))
        )}

        <Box px={1} py={2}>
          <Divider sx={{ mb: 3 }} />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="soft"
              color="error"
              disabled={!hasData || allApproved}
              onClick={() => setRejectOpen(true)}
            >
              Decline
            </Button>
            <Button
              variant="soft"
              color="success"
              disabled={!hasData || allApproved}
              onClick={handleApproveAll}
            >
              Approve
            </Button>
          </Stack>
        </Box>
      </Stack>

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
