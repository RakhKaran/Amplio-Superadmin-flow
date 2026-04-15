import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Stack,
  Avatar,
  Divider,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { useRouter } from 'src/routes/hook';

import axiosInstance from 'src/utils/axios';
import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label';
import { MultiFilePreview } from 'src/components/upload';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';
import Iconify from 'src/components/iconify';
import { format } from 'date-fns';

const STATUS_DISPLAY = {
  0: { label: 'Pending', color: 'warning' },
  1: { label: 'Under Review', color: 'info' },
  2: { label: 'Approved', color: 'success' },
  3: { label: 'Rejected', color: 'error' },
};

export default function MerchantProfileDetails({ data, refreshProfilesDetails }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fields = [
    { name: 'email', label: 'Email', value: data?.data?.users?.email },
    { name: 'phone', label: 'Contact No', value: data?.data?.users?.phone },
    { name: 'CIN', label: 'CIN', value: data?.data?.CIN },
    { name: 'GSTIN', label: 'GSTIN', value: data?.data?.GSTIN },
    {
      name: 'dateOfIncorporation',
      label: 'Date Of Incorporation',
      value: data?.data?.dateOfIncorporation ? format(new Date(data?.data?.dateOfIncorporation), 'dd/MM/yyyy') : '—',
    },
    {
      name: 'cityOfIncorporation',
      label: 'City Of Incorporation',
      value: data?.data?.cityOfIncorporation,
    },
    {
      name: 'stateOfIncorporation',
      label: 'State Of Incorporation',
      value: data?.data?.stateOfIncorporation,
    },
    {
      name: 'countryOfIncorporation',
      label: 'Country Of Incorporation',
      value: data?.data?.countryOfIncorporation,
    },
    {
      name: 'udyamRegistrationNumber',
      label: 'Udyam Registration Number',
      value: data?.data?.udyamRegistrationNumber,
    },
    {
      name: 'createdAt',
      label: 'Created At',
      value: data?.data?.createdAt ? format(new Date(data?.data?.createdAt), 'dd/MM/yyyy') : '—',
    },
  ];


const defaultValues = Object.fromEntries(fields.map((f) => [f.name, f.value || '']));

const methods = useForm({ defaultValues });

const { reset } = methods;

useEffect(() => {
  if (data)
    reset({
      ...defaultValues,
      panCardImage: data?.data?.merchantPanCard?.media || null,
    });
}, [data, reset, defaultValues]);

const handleStatusUpdate = async (type, reason = null) => {
  try {
    setLoading(true);

    const payload = {
      applicationId: data?.data?.kycApplicationsId,
      status: type,
    };

    if (type === 3 && typeof reason === 'string' && reason.trim()) {
      payload.reason = reason.trim();
    }

    await axiosInstance.patch('/kyc/handle-kyc-application', payload);

    enqueueSnackbar(`Merchant KYC ${String(type) === '2' ? 'Approved' : 'Rejected'}`, {
      variant: String(type) === '2' ? 'success' : 'error',
    });

    refreshProfilesDetails();
    setTimeout(() => router.back(), 800);
  } catch (error) {
    enqueueSnackbar(error?.error?.message || 'Something went wrong', {
      variant: 'error',
    });
  } finally {
    setLoading(false);
  }
};

const [openPreview, setOpenPreview] = useState(false);

const panFile = data?.data?.merchantPanCard?.media?.fileUrl;
const fileType = data?.data?.merchantPanCard?.media?.fileType;

const handleViewFile = () => {
  if (!panFile) return;

  if (fileType?.includes('pdf')) {
    window.open(panFile, '_blank'); // open PDF in full tab
  } else {
    setOpenPreview(true); // open image modal
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

const panComparisonData = [
  {
    parameter: 'PAN Number',
    extracted: data?.data?.merchantPanCard?.extractedPanNumber || '—',
    submitted: data?.data?.merchantPanCard?.submittedPanNumber || '—',
  },
  {
    parameter: 'Merchant Name',
    extracted: data?.data?.merchantPanCard?.extractedMerchantName || '—',
    submitted: data?.data?.merchantPanCard?.submittedMerchantName || '—',
  },
  // {
  //   parameter: "Date of Birth / Incorporation",
  //   extracted: data?.data?.merchantPanCard?.extractedDateOfBirth ? new Date(data?.data?.merchantPanCard?.extractedDateOfBirth).toLocaleDateString() : "—",
  //   submitted: data?.data?.merchantPanCard?.submittedDateOfBirth ? new Date(data?.data?.merchantPanCard?.submittedDateOfBirth).toLocaleDateString() : "—",
  // },
];

return (
  <Card sx={{ p: 4 }}>
    <FormProvider methods={methods}>
      {/* -------- Header Section -------- */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* Avatar + Name */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={data?.data?.merchantName} />

          <Stack spacing={0.8}>
            <Typography variant="h5" fontWeight={600}>
              {data?.data?.merchantName}
            </Typography>
          </Stack>
        </Stack>

        {/* Status */}
        <Label
          color={STATUS_DISPLAY[data?.data?.kycApplications?.status]?.color || 'default'}
          sx={{ px: 2, py: 1, borderRadius: 1 }}
        >
          {STATUS_DISPLAY[data?.data?.kycApplications?.status]?.label || 'Unknown'}
        </Label>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* -------- Read-Only Form Fields -------- */}
      <Grid container spacing={2}>
        {fields.map((field) => (
          <Grid item xs={12} sm={6} key={field.name}>
            <RHFTextField name={field.name} label={field.label} disabled />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            PAN Card Details
          </Typography>

          {/* {data?.data?.merchantPanCard?.media?.fileUrl ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  const url = data?.data?.merchantPanCard?.media?.fileUrl;
                  if (url) {
                    window.open(url, '_blank');
                  } else {
                    enqueueSnackbar('PAN preview file not found!', { variant: 'error' });
                  }
                }}
                sx={{
                  height: 32,
                  px: 1.5,
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                }}
                startIcon={<Iconify icon="mdi:eye" />}
              >
                Preview PAN Card
              </Button>
            ) : (
              <Typography color="text.secondary">No PAN file uploaded.</Typography>
            )} */}
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
        </Grid>
      </Grid>

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
              <TableCell sx={{ backgroundColor: '#2F2F2F', color: '#fff', fontWeight: 600 }}>
                Parameter
              </TableCell>
              <TableCell sx={{ backgroundColor: 'info.darker', color: '#fff', fontWeight: 700 }}>
                Extracted
              </TableCell>
              <TableCell sx={{ backgroundColor: '#00A786', color: '#fff', fontWeight: 600 }}>
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
      {openPreview && (
        <Box
          onClick={() => setOpenPreview(false)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            cursor: 'zoom-out',
          }}
        >
          <img
            src={panFile}
            alt="Preview"
            style={{
              maxWidth: '80%',
              maxHeight: '80%',
              borderRadius: 10,
              boxShadow: '0px 4px 10px rgba(0,0,0,0.4)',
            }}
          />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      {/* -------- Action Buttons -------- */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="soft" onClick={() => router.back()} disabled={loading}>
          Close
        </Button>

        <Button
          variant="soft"
          color="error"
          onClick={() => setRejectOpen(true)}
          disabled={loading || data?.data?.kycApplications?.status === 2}
        >
          Decline
        </Button>

        <Button
          variant="soft"
          color="success"
          onClick={() => handleStatusUpdate(2)}
          disabled={loading || data?.data?.kycApplications?.status === 2}
        >
          Approve
        </Button>
      </Stack>
    </FormProvider>
    <RejectReasonDialog
      title="Decline Merchant Profile"
      open={rejectOpen}
      onClose={() => setRejectOpen(false)}
      reason={rejectReason}
      setReason={setRejectReason}
      onSubmit={handleRejectSubmit}
    />
  </Card>
);
}

MerchantProfileDetails.propTypes = {
  data: PropTypes.object,
};
