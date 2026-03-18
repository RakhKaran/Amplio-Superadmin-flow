import PropTypes from 'prop-types';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from '@mui/material';
import Label from 'src/components/label';

export default function InvestorSignatories({ signatories }) {
  if (!signatories || signatories.length === 0) {
    return (
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="body1">No signatories available.</Typography>
      </Card>
    );
  }

  return (
    <Card sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Authorized Signatories
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Designation</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Mobile</b></TableCell>
              <TableCell><b>Status</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {signatories.map((sig) => (
              <TableRow key={sig.id}>
                <TableCell>{sig.name}</TableCell>
                <TableCell>{sig.designation}</TableCell>
                <TableCell>{sig.email}</TableCell>
                <TableCell>{sig.mobile}</TableCell>
                <TableCell>
                  <Label variant="soft" color="success">
                    {sig.status}
                  </Label>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

InvestorSignatories.propTypes = {
  signatories: PropTypes.array,
};
