import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { format } from 'date-fns';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { enqueueSnackbar } from 'notistack';
import DocumentPreviewButton from 'src/components/custom-preview-button/preview-button';

// ----------------------------------------------------------------------

const statusConfig = {
  0: { label: 'pending', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

const verificationConfig = {
  true: { label: 'Verified', color: 'success' },
  false: { label: 'Pending', color: 'warning' },
};


export default function RocTableRow({ row, selected }) {
  const { serviceRequestNumber, date, media, status, chargeFiling } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{serviceRequestNumber || 'NA'}</TableCell>

      <TableCell>
        {date ? format(new Date(date), 'dd/MM/yyyy') : '-'}
      </TableCell>

      <TableCell>
        <DocumentPreviewButton
          fileName={chargeFiling?.fileName}
          fileUrl={chargeFiling?.fileUrl}
          errorMessage="File not found"
          buttonText="Preview Document"
        />
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={statusConfig[Number(status)]?.color || 'default'}
        >
          {statusConfig[Number(status)]?.label || 'Unknown'}
        </Label>
      </TableCell>
    </TableRow>
  );
}

RocTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
