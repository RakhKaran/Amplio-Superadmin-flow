import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
// components
import Label from 'src/components/label';
import { fIndianCurrency } from 'src/utils/format-number';

export default function SettlementMismatchTableRow({ row }) {
  const { id, merchant, expected, received, difference} = row;

  return (
    <TableRow hover>
      <TableCell sx={{ fontWeight: 700 }}>{id}</TableCell>

      <TableCell>
        {merchant}
      </TableCell>

      <TableCell>
        {fIndianCurrency(expected)}
      </TableCell>

      <TableCell>
        {fIndianCurrency(received)}
      </TableCell>

      <TableCell>
        <Typography
          variant="body2"
          sx={{
            color:
              (row.difference < 0 && 'error.main') ||
              (row.difference > 0 && 'success.main') ||
              'text.primary',
            fontWeight: 'bold',
          }}
        >
          {row.difference > 0 ? `+${fIndianCurrency(row.difference)}` : fIndianCurrency(row.difference)}
        </Typography>
      </TableCell>

      {/* <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {utr}
        </Typography>
      </TableCell> */}
    </TableRow>
  );
}

SettlementMismatchTableRow.propTypes = {
  row: PropTypes.object,
};
