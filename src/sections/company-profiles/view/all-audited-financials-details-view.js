import { useState } from 'react';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import { useSnackbar } from 'notistack';
import { useSettingsContext } from 'src/components/settings';
import axiosInstance from 'src/utils/axios';

import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';

// list views
import AuditedFinancialsListView from './audited-financial-list-view';
import AuditedFinancialsIncomeTaxReturnListView from './audited-financial-income-tax-return';
import AuditedFinancialsGstr9ListView from './audited-financial-gstr9-list-view';
import AuditedFinancialsGst3bListView from './audited-financial-gst3b-list-view';

import { useGetAuditedFinancialsDetails } from 'src/api/companyKyc';

export default function AllAuditedFinancialsDetailsView({ companyProfile }) {
  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const companyProfilesId = companyProfile?.data?.id;

  const { auditedFinancials = [] } =
    useGetAuditedFinancialsDetails(companyProfilesId);

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');


  const handleApproveAll = async () => {
    await axiosInstance.patch(
      '/company-profiles/audited-financial-verification',
      {
        companyProfilesId,
        status: 1,
        reason: '',
      }
    );

    enqueueSnackbar('Audited financials approved', { variant: 'success' });
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) return;

    await axiosInstance.patch(
      '/company-profiles/audited-financial-verification',
      {
        companyProfilesId,
        status: 2,
        reason: rejectReason,
      }
    );

    enqueueSnackbar('Audited financials rejected', { variant: 'error' });
    setRejectOpen(false);
    setRejectReason('');
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack spacing={4}>

        <Box px={3} pt={3}>
          <Typography variant="h6">
            Financial Statements (Last 3 Years)
          </Typography>
        </Box>
        <AuditedFinancialsListView companyProfile={companyProfile} />

        <Box px={3} pt={3}>
          <Typography variant="h6">
            Income Tax Returns (Last 3 Years)
          </Typography>
        </Box>
        <AuditedFinancialsIncomeTaxReturnListView companyProfile={companyProfile} />

        <Box px={3} pt={3}>
          <Typography variant="h6">
            Audited GSTR-9 Annual Returns (Last 3 Years)
          </Typography>
        </Box>
        <AuditedFinancialsGstr9ListView companyProfile={companyProfile} />

        <Box px={3} pt={3}>
          <Typography variant="h6">
            GST-3B (Past 6 Months)
          </Typography>
        </Box>
        <AuditedFinancialsGst3bListView companyProfile={companyProfile} />

        {/* ACTIONS */}
        <Box px={3} py={3}>
          <Divider sx={{ mb: 3 }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="soft"
              color="error"
              onClick={() => setRejectOpen(true)}
            >
              Decline
            </Button>

            <Button
              variant="soft"
              color="success"
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
    </Container>
  );
}
