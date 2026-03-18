import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function PSPTransactionHistoryRow({ row }) {
  const { 
    id, 
    merchantName, 
    amount, 
    status, 
    paymentMode, 
    gateway, 
    settlementId, 
    spv, 
    dateTime, 
    remark 
  } = row;

  const getRemarkColor = (text) => {
    if (text.toLowerCase().includes('successfully')) return 'success.main';
    if (text.toLowerCase().includes('pending')) return 'warning.main';
    if (text.toLowerCase().includes('failed')) return 'error.main';
    return 'text.secondary';
  };

  return (
    <TableRow hover>
      <TableCell sx={{ fontWeight: 'bold' }}>{id}</TableCell>

      <TableCell>
        <ListItemText
          primary={merchantName}
          primaryTypographyProps={{ variant: 'body2', noWrap: true }}
        />
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {amount}
        </Typography>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'Settled' && 'success') ||
            (status === 'Processing' && 'info') ||
            (status === 'Failed' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell>
        <Label variant="outline" color="default" sx={{ fontSize: 10 }}>
          {paymentMode}
        </Label>
      </TableCell>

      <TableCell>{gateway}</TableCell>

      <TableCell>{settlementId}</TableCell>

      <TableCell>{spv}</TableCell>

      <TableCell>
        <ListItemText
          primary={dateTime.split(' ')[0]}
          secondary={dateTime.split(' ')[1]}
          primaryTypographyProps={{ variant: 'body2', noWrap: true }}
          secondaryTypographyProps={{ variant: 'caption' }}
        />
      </TableCell>

      <TableCell sx={{ maxWidth: 200 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: getRemarkColor(remark),
            fontWeight: 500
          }}
        >
          {remark}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

PSPTransactionHistoryRow.propTypes = {
  row: PropTypes.object,
};
