import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
// components
import Scrollbar from 'src/components/scrollbar';
// utils
import { fIndianCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function SettlementMismatches({ mismatches }) {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Settlement Mismatches
      </Typography>

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Merchant Name</TableCell>
                <TableCell align="right">Expected Amount</TableCell>
                <TableCell align="right">Received Amount</TableCell>
                <TableCell align="right">Difference</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {mismatches.map((row) => (
                <TableRow key={row.id}>
                  <TableCell sx={{ fontWeight: 'bold' }}>{row.id}</TableCell>
                  <TableCell>{row.merchant}</TableCell>
                  <TableCell align="right">{fIndianCurrency(row.expected)}</TableCell>
                  <TableCell align="right">{fIndianCurrency(row.received)}</TableCell>
                  <TableCell align="right">
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

SettlementMismatches.propTypes = {
  mismatches: PropTypes.array,
};
