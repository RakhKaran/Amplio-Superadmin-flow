import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function PSPActiveSettlementsRow({ row }) {
  const { id, merchantName, amount, initiated, expected, status } = row;

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

      <TableCell>{amount}</TableCell>

      <TableCell>{initiated}</TableCell>

      <TableCell>{expected}</TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'Processing' && 'info') ||
            (status === 'Pending Confirmation' && 'warning') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>
    </TableRow>
  );
}

PSPActiveSettlementsRow.propTypes = {
  row: PropTypes.object,
};
