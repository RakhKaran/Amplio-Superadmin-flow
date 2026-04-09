import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { TableNoData } from 'src/components/table';
import { useGetSignatories } from 'src/api/investorKyc';
import InvestorSignatoriesDetails from './investor-signatory-details';

const getStatusMeta = (status) => {
  if (Number(status) === 1) return { color: 'success', label: 'Approved' };
  if (Number(status) === 2) return { color: 'error', label: 'Rejected' };
  return { color: 'warning', label: 'Under Review' };
};

export default function InvestorSignatoriesApproval({ investorId }) {
  const { signatories, refreshSignatories } = useGetSignatories(investorId);
  const [selectedSignatory, setSelectedSignatory] = useState(null);

  return (
    <>
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" sx={{ mb: 0.5 }}>
            Signatory Approval
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Review submitted signatories in the same approval layout used for merchant-style review.
          </Typography>
        </Box>

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 860 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {signatories.length === 0 ? (
                  <TableNoData notFound />
                ) : (
                  signatories.map((signatory) => {
                    const { color, label } = getStatusMeta(signatory.status);

                    return (
                      <TableRow hover key={signatory.id}>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {signatory.fullName || '-'}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {signatory.email || '-'}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {signatory.phone || '-'}
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {signatory.designationValue || '-'}
                        </TableCell>
                        <TableCell>
                          <Label color={color}>{label}</Label>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View" placement="top" arrow>
                            <IconButton onClick={() => setSelectedSignatory(signatory)}>
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

      <Dialog
        open={!!selectedSignatory}
        onClose={() => setSelectedSignatory(null)}
        fullWidth
        maxWidth={false}
        PaperProps={{ sx: { maxWidth: 960 } }}
      >
        <DialogTitle color="primary">Signatory Details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedSignatory && (
            <InvestorSignatoriesDetails
              currentUser={selectedSignatory}
              isViewMode
              isEditMode={false}
              disableCardWrapper
              onStatusChange={() => {
                refreshSignatories();
                setSelectedSignatory(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

InvestorSignatoriesApproval.propTypes = {
  investorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
