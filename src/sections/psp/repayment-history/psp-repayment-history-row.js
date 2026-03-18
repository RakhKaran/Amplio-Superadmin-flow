import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function PSPRepaymentHistoryRow({ row }) {
  const { id, merchantName, amount, date, time, utr, status } = row;

  return (
    <TableRow hover>
      <TableCell sx={{ fontWeight: 'bold' }}>{id}</TableCell>

      <TableCell>
        <ListItemText
          primary={merchantName}
          primaryTypographyProps={{ variant: 'body2', noWrap: true }}
          secondaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
        />
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
          {amount}
        </Typography>
      </TableCell>

      <TableCell>{date}</TableCell>

      <TableCell>{time}</TableCell>

      <TableCell>{utr}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={(status === 'Completed' && 'success') || 'default'}
        >
          {status}
        </Label>
      </TableCell>
    </TableRow>
  );
}

PSPRepaymentHistoryRow.propTypes = {
  row: PropTypes.object,
};
