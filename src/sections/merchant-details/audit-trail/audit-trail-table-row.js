import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export default function AuditTrailTableRow({ row }) {
  const { timestamp, admin, action, changes } = row;

  return (
    <TableRow hover>
      <TableCell sx={{ color: 'text.secondary' }}>{timestamp}</TableCell>
      <TableCell>{admin}</TableCell>
      <TableCell sx={{ fontWeight: 600 }}>{action}</TableCell>
      <TableCell sx={{ color: 'info.main', fontWeight: 500 }}>{changes}</TableCell>
    </TableRow>
  );
}

AuditTrailTableRow.propTypes = {
  row: PropTypes.object,
};
