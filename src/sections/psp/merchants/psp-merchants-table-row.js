import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function PSPMerchantsTableRow({ row }) {
  const { name, merchantId, volume, settlements, status } = row;

  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemText
          primary={name}
          secondary={merchantId}
          primaryTypographyProps={{ typography: 'subtitle2', fontWeight: 'bold' }}
          secondaryTypographyProps={{ component: 'span', color: 'text.disabled', typography: 'caption' }}
        />
      </TableCell>

      <TableCell>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {merchantId}
        </Typography>
      </TableCell>

      <TableCell>
        <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          {volume}
        </Typography>
      </TableCell>

      <TableCell align="center">
        <Typography variant="body2">
          {settlements}
        </Typography>
      </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={(status === 'Active' && 'success') || 'default'}
        >
          {status}
        </Label>
      </TableCell>
    </TableRow>
  );
}

PSPMerchantsTableRow.propTypes = {
  row: PropTypes.object,
};
