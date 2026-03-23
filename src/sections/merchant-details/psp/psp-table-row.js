import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { format } from 'date-fns';
import { Box, Chip, IconButton, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import { color } from 'framer-motion';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

const statusMap = {
  0: { label: 'Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

export default function PSPTableRow({ row, selected, onSelectRow, onViewRow, onEditRow }) {
  const { pspMaster, merchantId, settlementAccount, apiKey, apiSecret, status } = row;

  const statusInfo = statusMap[status] || statusMap[0];

  return (
    <TableRow hover selected={selected}>
      <TableCell>{pspMaster.name || 'NA'}</TableCell>

      <TableCell>{merchantId || '-'}</TableCell>

      <TableCell>{settlementAccount || '-'}</TableCell>

      <TableCell>{apiKey || '-'}</TableCell>

      <TableCell>{apiSecret || '-'}</TableCell>

      <TableCell>
        <Label color={statusInfo.color}>{statusInfo.label}</Label>
      </TableCell>

      <TableCell>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Tooltip title="View" placement="top" arrow>
            <IconButton onClick={onEditRow}>
              <Iconify icon="solar:eye-bold" width={20} />
            </IconButton>
          </Tooltip>
          {/* <Tooltip title="View" placement="top" arrow>
            <IconButton onClick={onViewRow}>
              <Iconify icon="mdi:eye" width={20} />
            </IconButton>
          </Tooltip> */}
        </Box>
      </TableCell>
    </TableRow>
  );
}

PSPTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
