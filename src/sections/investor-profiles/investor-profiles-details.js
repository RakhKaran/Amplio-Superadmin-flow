import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import { useRouter } from 'src/routes/hook';
import axiosInstance from 'src/utils/axios';
import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';

const STATUS_DISPLAY = {
  0: { label: 'Pending', color: 'warning' },
  1: { label: 'Under Review', color: 'info' },
  2: { label: 'Approved', color: 'success' },
  3: { label: 'Rejected', color: 'error' },
};

export default function InvestorProfileDetails({ data, onRefresh }) {
  const investor = useMemo(() => data?.data || {}, [data]);
  const investorType = String(
    investor?.investorKycType || investor?.investorType || investor?.kycType || 'individual'
  ).toLowerCase();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const panCardDetails = useMemo(() => investor?.investorPanCards || {}, [investor]);

  const fields = useMemo(
    () =>
      investorType === 'institutional'
        ? [
            { name: 'email', label: 'Email', value: investor?.users?.email },
            { name: 'phone', label: 'Contact No', value: investor?.users?.phone },
            {
              name: 'companyName',
              label: 'Company Name',
              value: investor?.companyName || investor?.fullName,
            },
            { name: 'cin', label: 'CIN', value: investor?.CIN || investor?.cin || '-' },
            { name: 'gstin', label: 'GSTIN', value: investor?.GSTIN || investor?.gstin || '-' },
            {
              name: 'dateOfIncorporation',
              label: 'Date Of Incorporation',
              value: investor?.dateOfIncorporation
                ? investor.dateOfIncorporation.split('T')[0]
                : '-',
            },
            {
              name: 'cityOfIncorporation',
              label: 'City Of Incorporation',
              value: investor?.cityOfIncorporation || '-',
            },
            {
              name: 'stateOfIncorporation',
              label: 'State Of Incorporation',
              value: investor?.stateOfIncorporation || '-',
            },
            {
              name: 'countryOfIncorporation',
              label: 'Country Of Incorporation',
              value: investor?.countryOfIncorporation || '-',
            },
            { name: 'kycMode', label: 'KYC Mode', value: investor?.kycMode || '-' },
            {
              name: 'createdAt',
              label: 'Created At',
              value: investor?.createdAt ? investor.createdAt.split('T')[0] : '-',
            },
          ]
        : [
            { name: 'email', label: 'Email', value: investor?.users?.email },
            { name: 'phone', label: 'Contact No', value: investor?.users?.phone },
            { name: 'fullName', label: 'Name', value: investor?.fullName || '-' },
            { name: 'gender', label: 'Gender', value: investor?.gender || '-' },
            {
              name: 'pan',
              label: 'PAN Number',
              value:
                investor?.investorPanCards?.submittedPanNumber ||
                investor?.investorPanCards?.extractedPanNumber ||
                '-',
            },
            {
              name: 'dateOfBirth',
              label: 'Date Of Birth',
              value: investor?.investorPanCards?.submittedDateOfBirth
                ? investor.investorPanCards.submittedDateOfBirth.split('T')[0]
                : '-',
            },
            { name: 'kycMode', label: 'KYC Mode', value: investor?.kycMode || '-' },
            {
              name: 'createdAt',
              label: 'Created At',
              value: investor?.createdAt ? investor.createdAt.split('T')[0] : '-',
            },
          ],
    [investor, investorType]
  );

  const methods = useForm({
    defaultValues: Object.fromEntries(fields.map((field) => [field.name, field.value || ''])),
  });

  const { reset } = methods;

  useEffect(() => {
    reset({
      ...Object.fromEntries(fields.map((field) => [field.name, field.value || ''])),
      panCardImage: panCardDetails?.panCardDocument || panCardDetails?.media || null,
      aadhaarFrontImage: investor?.aadharFrontImage || investor?.aadhaarFrontImage || null,
      aadhaarBackImage: investor?.aadharBackImage || investor?.aadhaarBackImage || null,
      selfieImage: investor?.selfie || investor?.selfieImage || null,
    });
  }, [fields, investor, panCardDetails, reset]);

  const panComparisonData = useMemo(() => {
    const rows = [
      {
        parameter: 'PAN Number',
        extracted:
          panCardDetails?.extractedPanNumber ||
          panCardDetails?.panNumber ||
          '-',
        submitted:
          panCardDetails?.submittedPanNumber ||
          panCardDetails?.panNumber ||
          '-',
      },
      {
        parameter: investorType === 'institutional' ? 'Investor Name' : 'Investor Name',
        extracted:
          panCardDetails?.extractedInvestorName ||
          panCardDetails?.extractedMerchantName ||
          panCardDetails?.extractedPanHolderName ||
          '-',
        submitted:
          panCardDetails?.submittedInvestorName ||
          panCardDetails?.submittedMerchantName ||
          panCardDetails?.submittedPanHolderName ||
          '-',
      },
    ];

    const extractedDate =
      panCardDetails?.extractedDateOfBirth ||
      panCardDetails?.extractedDateOfIncorporation ||
      null;
    const submittedDate =
      panCardDetails?.submittedDateOfBirth ||
      panCardDetails?.submittedDateOfIncorporation ||
      null;

    if (extractedDate || submittedDate) {
      rows.push({
        parameter:
          investorType === 'institutional' ? 'Date of Incorporation' : 'Date of Birth',
        extracted: extractedDate ? String(extractedDate).split('T')[0] : '-',
        submitted: submittedDate ? String(submittedDate).split('T')[0] : '-',
      });
    }

    return rows;
  }, [investorType, panCardDetails]);

  const isApproved = Number(investor?.kycApplications?.status) === 2;

  const handleStatusUpdate = async (type, reason = '') => {
    try {
      setLoading(true);

      const payload = {
        applicationId: investor?.kycApplicationsId,
        status: type,
      };

      if (typeof reason === 'string' && reason.trim()) {
        payload.rejectReason = reason.trim();
      }

      await axiosInstance.patch('/kyc/handle-kyc-application', payload);

      await onRefresh?.();
      reset({
        ...Object.fromEntries(fields.map((field) => [field.name, field.value || ''])),
        panCardImage: panCardDetails?.panCardDocument || panCardDetails?.media || null,
        aadhaarFrontImage: investor?.aadharFrontImage || investor?.aadhaarFrontImage || null,
        aadhaarBackImage: investor?.aadharBackImage || investor?.aadhaarBackImage || null,
        selfieImage: investor?.selfie || investor?.selfieImage || null,
      });

      enqueueSnackbar(`Investor KYC ${String(type) === '2' ? 'Approved' : 'Rejected'}`, {
        variant: String(type) === '2' ? 'success' : 'error',
      });
    } catch (error) {
      enqueueSnackbar(error?.error?.message || error?.response?.data?.message || error?.message || 'Something went wrong', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      enqueueSnackbar('Please enter a reason', { variant: 'warning' });
      return;
    }

    handleStatusUpdate(3, rejectReason);
    setRejectOpen(false);
    setRejectReason('');
  };

  return (
    <Card sx={{ p: 4 }}>
      <FormProvider methods={methods}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={investor?.fullName || investor?.companyName} />
            <Stack spacing={0.8}>
              <Typography variant="h5" fontWeight={600}>
                {investor?.companyName || investor?.fullName || 'Investor'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {investorType === 'institutional' ? 'Institutional Investor' : 'Individual Investor'}
              </Typography>
            </Stack>
          </Stack>

          <Label
            color={STATUS_DISPLAY[investor?.kycApplications?.status]?.color || 'default'}
            sx={{ px: 2, py: 1, borderRadius: 1 }}
          >
            {STATUS_DISPLAY[investor?.kycApplications?.status]?.label || 'Unknown'}
          </Label>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              <RHFTextField name={field.name} label={field.label} disabled />
            </Grid>
          ))}
        </Grid>

        {investor?.investorPanCards && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              PAN Card Details
            </Typography>
            <RHFCustomFileUploadBox
              name="panCardImage"
              label="Pancard"
              icon="mdi:file-document-outline"
              accept={{
                'application/pdf': ['.pdf'],
                'image/png': ['.png'],
                'image/jpeg': ['.jpg', '.jpeg'],
              }}
              disabled
            />

            <TableContainer
              component={Paper}
              sx={{
                mt: 3,
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0px 3px 8px rgba(0,0,0,0.1)',
                border: '1px solid #BDBDBD',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ backgroundColor: '#2F2F2F', color: '#fff', fontWeight: 600 }}
                    >
                      Parameter
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: 'info.darker', color: '#fff', fontWeight: 700 }}
                    >
                      Extracted
                    </TableCell>
                    <TableCell
                      sx={{ backgroundColor: '#00A786', color: '#fff', fontWeight: 600 }}
                    >
                      Submitted
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {panComparisonData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontWeight: 500 }}>{row.parameter}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{row.extracted}</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>{row.submitted}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {investorType === 'individual' && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Identity Documents
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <RHFCustomFileUploadBox
                  name="aadhaarFrontImage"
                  label="Aadhaar Front Image"
                  icon="mdi:file-document-outline"
                  accept={{
                    'application/pdf': ['.pdf'],
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                  }}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <RHFCustomFileUploadBox
                  name="aadhaarBackImage"
                  label="Aadhaar Back Image"
                  icon="mdi:file-document-outline"
                  accept={{
                    'application/pdf': ['.pdf'],
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                  }}
                  disabled
                />
              </Grid>

              <Grid item xs={12}>
                <RHFCustomFileUploadBox
                  name="selfieImage"
                  label="Selfie Image"
                  icon="mdi:file-document-outline"
                  accept={{
                    'application/pdf': ['.pdf'],
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpg', '.jpeg'],
                  }}
                  disabled
                />
              </Grid>
            </Grid>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="soft" onClick={() => router.back()} disabled={loading}>
            Close
          </Button>
          <Button
            variant="soft"
            color="error"
            onClick={() => setRejectOpen(true)}
            disabled={loading || isApproved}
          >
            Decline
          </Button>
          <Button
            variant="soft"
            color="success"
            onClick={() => handleStatusUpdate(2)}
            disabled={loading || isApproved}
          >
            Approve
          </Button>
        </Stack>
      </FormProvider>

      <RejectReasonDialog
        title="Decline Investor Profile"
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />
    </Card>
  );
}

InvestorProfileDetails.propTypes = {
  data: PropTypes.object,
  onRefresh: PropTypes.func,
};
