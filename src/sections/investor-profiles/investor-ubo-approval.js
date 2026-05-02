import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Button,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';

import axiosInstance from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import DocumentPreviewButton from 'src/components/custom-preview-button/preview-button';
import Scrollbar from 'src/components/scrollbar';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';
import { TableNoData } from 'src/components/table';
import { useGetUBOs } from 'src/api/investorKyc';

const UBO_ROLES = [
  { value: 'proprietor', label: 'Proprietor (Sole Owner)' },
  { value: 'partner', label: 'Partner' },
  { value: 'designated_partner', label: 'Designated Partner (LLP)' },
  { value: 'director', label: 'Director' },
  { value: 'shareholder', label: 'Shareholder' },
  { value: 'authorized_signatory', label: 'Authorized Signatory' },
  { value: 'trustee', label: 'Trustee' },
  { value: 'beneficiary', label: 'Beneficiary Owner' },
  { value: 'other', label: 'Other' },
];

const getStatusMeta = (status) => {
  if (Number(status) === 1) return { color: 'success', label: 'Approved' };
  if (Number(status) === 2) return { color: 'error', label: 'Rejected' };
  return { color: 'warning', label: 'Under Review' };
};

function InvestorUboReviewDialog({ open, onClose, currentUbo, refreshUbos }) {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const defaultValues = useMemo(
    () => ({
      name: currentUbo?.fullName || '',
      email: currentUbo?.email || '',
      phoneNumber: currentUbo?.phone || '',
      ownershipPercentage: currentUbo?.ownershipPercentage || '',
      role: currentUbo?.designationValue || '',
      submittedPanFullName: currentUbo?.submittedPanFullName || '',
      submittedPanNumber: currentUbo?.submittedPanNumber || '',
      submittedDateOfBirth: currentUbo?.submittedDateOfBirth
        ? new Date(currentUbo.submittedDateOfBirth)
        : null,
    }),
    [currentUbo]
  );

  const methods = useForm({
    defaultValues,
  });

  const isFinalStatus = [1, 2].includes(Number(currentUbo?.status));

  const handleStatusUpdate = async (status, reason = '') => {
    if (!currentUbo?.id) return;

    try {
      setLoading(true);

      await axiosInstance.patch('/investor-profiles/ubo-verification', {
        uboId: currentUbo.id,
        status,
        reason,
      });

      enqueueSnackbar(`UBO ${status === 1 ? 'approved' : 'rejected'} successfully`, {
        variant: status === 1 ? 'success' : 'error',
      });

      refreshUbos?.();
      onClose?.();
    } catch (error) {
      enqueueSnackbar(error?.error?.message || error?.message || 'Failed to update UBO status', {
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      enqueueSnackbar('Please enter a reason', { variant: 'warning' });
      return;
    }

    await handleStatusUpdate(2, rejectReason);
    setRejectOpen(false);
    setRejectReason('');
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth={false}
        PaperProps={{ sx: { maxWidth: 760 } }}
      >
        <DialogTitle color="primary">View UBO</DialogTitle>

        <DialogContent sx={{ pt: 2, pb: 3 }}>
          <FormProvider methods={methods}>
            <Box rowGap={3} display="grid" sx={{ py: 1 }}>
              <RHFTextField name="name" label="Name*" disabled />
              <RHFTextField name="email" label="Email*" disabled />
              <RHFTextField name="phoneNumber" label="Phone Number*" disabled />
              <RHFTextField name="ownershipPercentage" label="Ownership Percentage*" disabled />

              <RHFSelect name="role" label="Designation*" disabled>
                {UBO_ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </RHFSelect>

              <Typography variant="subtitle2" color="primary">
                PAN Section
              </Typography>

              <DocumentPreviewButton
                fileName={currentUbo?.panCard?.fileOriginalName}
                fileUrl={currentUbo?.panCard?.fileUrl}
                errorMessage="PAN card not found"
                buttonText="Preview PAN Card"
              />

              <RHFTextField name="submittedPanFullName" label="PAN Holder Full Name*" disabled />
              <RHFTextField name="submittedPanNumber" label="PAN Number*" disabled />

              <Controller
                name="submittedDateOfBirth"
                control={methods.control}
                render={({ field }) => (
                  <DatePicker
                    label="PAN Date of Birth*"
                    disabled
                    value={field.value instanceof Date && !Number.isNaN(field.value) ? field.value : null}
                    onChange={field.onChange}
                    format="dd/MM/yyyy"
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                )}
              />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3, pt: 1 }}>
              <Button
                variant="soft"
                color="error"
                disabled={loading || isFinalStatus}
                onClick={() => setRejectOpen(true)}
              >
                Decline
              </Button>

              <Button
                variant="soft"
                color="success"
                disabled={loading || isFinalStatus}
                onClick={() => handleStatusUpdate(1)}
              >
                Approve
              </Button>
            </Stack>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <RejectReasonDialog
        title="Reject UBO"
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />
    </>
  );
}

InvestorUboReviewDialog.propTypes = {
  currentUbo: PropTypes.object,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  refreshUbos: PropTypes.func,
};

export default function InvestorUboApproval({ investorId }) {
  const { ubos, refreshUbos } = useGetUBOs(investorId);
  const [selectedUbo, setSelectedUbo] = useState(null);

  return (
    <>
      <Card sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h5" sx={{ mb: 0.5 }}>
              UBO Approval
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review submitted beneficial owners in the same admin approval style as merchant.
            </Typography>
          </Box>

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Ownership %</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {ubos.length === 0 ? (
                    <TableNoData notFound />
                  ) : (
                    ubos.map((ubo) => {
                      const { color, label } = getStatusMeta(ubo.status);

                      return (
                        <TableRow hover key={ubo.id}>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{ubo.fullName || '-'}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{ubo.email || '-'}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>{ubo.phone || '-'}</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {ubo.ownershipPercentage || '-'}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {ubo.designationValue || '-'}
                          </TableCell>
                          <TableCell>
                            <Label color={color}>{label}</Label>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="View" placement="top" arrow>
                              <IconButton onClick={() => setSelectedUbo(ubo)}>
                                <Iconify icon="solar:eye-bold" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Stack>
      </Card>

      <InvestorUboReviewDialog
        open={!!selectedUbo}
        currentUbo={selectedUbo}
        onClose={() => setSelectedUbo(null)}
        refreshUbos={refreshUbos}
      />
    </>
  );
}

InvestorUboApproval.propTypes = {
  investorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
