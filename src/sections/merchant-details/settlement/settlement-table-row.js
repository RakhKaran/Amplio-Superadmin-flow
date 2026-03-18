import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
// utils
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function SettlementTableRow({ row }) {
  const [open, setOpen] = useState(false);

  const {
    id,
    date,
    status,
    netSettlement,
    grossAmount,
    d0Haircut,
    d1Haircut,
    processingFee,
    sourceAccount,
    sourceRef,
    destinationAccount,
    destinationRef,
    transferInitiated,
    creditReceived,
    utr,
    transactions,
  } = row;

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const renderAmount = (amount, isNegative = false) => (
    <Typography
      variant="body2"
      sx={{
        color: isNegative ? 'error.main' : 'text.primary',
        fontWeight: isNegative ? 'medium' : 'regular',
      }}
    >
      {isNegative ? `-₹${Math.abs(amount)}` : `₹${amount}`}
    </Typography>
  );

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>{id}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{date}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={(status === 'Completed' && 'success') || (status === 'Pending' && 'warning') || 'default'}
          >
            {status}
          </Label>
        </TableCell>
        <TableCell>{renderAmount(netSettlement)}</TableCell>
        <TableCell>{renderAmount(grossAmount)}</TableCell>
        <TableCell>{renderAmount(d0Haircut, true)}</TableCell>
        <TableCell>{renderAmount(d1Haircut, true)}</TableCell>
        <TableCell>{renderAmount(processingFee, true)}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{sourceAccount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{destinationAccount}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{transferInitiated}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{creditReceived}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{utr}</TableCell>
        <TableCell align="right">
          <Button
            size="small"
            color="primary"
            onClick={handleToggle}
            endIcon={
              <Iconify
                icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
              />
            }
          >
            Receivables ({transactions})
          </Button>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ p: 0, border: 'none' }} colSpan={14}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                m: 1,
                bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.50' : 'grey.900'),
              }}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Source Details
                    </Typography>
                    <Typography variant="body2">Account: {sourceAccount}</Typography>
                    <Typography variant="body2">Ref: {sourceRef}</Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Destination Details
                    </Typography>
                    <Typography variant="body2">Account: {destinationAccount}</Typography>
                    <Typography variant="body2">Ref: {destinationRef}</Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Timeline & UTR
                    </Typography>
                    <Typography variant="body2">Initiated: {transferInitiated}</Typography>
                    <Typography variant="body2">Received: {creditReceived}</Typography>
                    <Typography variant="body2">UTR: {utr}</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

SettlementTableRow.propTypes = {
  row: PropTypes.object,
};
