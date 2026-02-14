import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { format } from 'date-fns';
import { Button, IconButton, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';
import { useState } from 'react';

// ----------------------------------------------------------------------

const statusConfig = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

const verificationConfig = {
  0: { label: 'Pending', color: 'warning' },
  1: { label: 'Verified', color: 'success' },
  2: { label: 'Expired', color: 'error' },
};



export default function GuarantorTableRow({ row, selected, refreshGuarantorDetails, onViewRow, onEditRow }) {
  const { guarantorCompanyName, CIN, guarantorType, id, status, verificationStatus } = row;
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    try {
      setLoading(true);

      await axiosInstance.patch(
        `/business-kyc/guarantor-execution/${id}/resend`
      );

      enqueueSnackbar('Verification link resent successfully', {
        variant: 'success',
      });
      refreshGuarantorDetails();
    } catch (error) {
      enqueueSnackbar(
        error?.error?.message ||
        'Failed to resend verification link',
        { variant: 'error' }
      );
    } finally {
      setLoading(false);
    }
  };

  const verificationDisabled = verificationStatus === 1 || verificationStatus === 0;
  return (
    <TableRow hover selected={selected}>
      <TableCell>{guarantorCompanyName || 'NA'}</TableCell>

      <TableCell>{guarantorType || 'NA'}</TableCell>
      <TableCell>{CIN || 'NA'}</TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={statusConfig[Number(status)]?.color || 'default'}
        >
          {statusConfig[Number(status)]?.label || 'Unknown'}
        </Label>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={verificationConfig[verificationStatus]?.color}
        >
          {verificationConfig[verificationStatus]?.label}
        </Label>
      </TableCell>

      <TableCell>
        <Button
          variant="contained"
          color='primary'
          size="small"
          onClick={handleResend}
          disabled={loading || verificationDisabled}
        >
          {loading ? 'Sending...' : 'Resend Link'}
        </Button>
      </TableCell>



      <TableCell>
        {/* <Tooltip title="View Events">
            <IconButton onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip> */}
        <Tooltip title="Edit" placement="top" arrow>
          <IconButton onClick={onViewRow}>
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

GuarantorTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
