import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { format } from 'date-fns';
import { IconButton, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

const statusConfig = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

export default function GuarantorTableRow({ row, selected, onSelectRow, onViewRow, onEditRow }) {
  const { guarantorCompanyName, CIN, guarantorType, status } = row;

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
