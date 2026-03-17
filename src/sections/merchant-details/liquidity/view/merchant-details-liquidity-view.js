import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';
// @mui
import {
  Card,
  Grid,
  Stack,
  Switch,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  FormControlLabel,
} from '@mui/material';
// utils
import { fCurrency } from 'src/utils/format-number';
// 
import SummaryCard from 'src/components/summary-card';

// ----------------------------------------------------------------------

export default function MerchantDetailsLiquidityView({ merchant }) {
  const liquidity = merchant?.liquidity || {};

  const exposureLimits = useMemo(() => [
    { label: 'Credit Limit', value: fCurrency(liquidity.creditLimit * 10000000) }, // Mocking Cr value
    { label: 'Used', value: fCurrency(liquidity.used * 10000000) },
    { label: 'Available', value: fCurrency(liquidity.available * 10000000), color: 'success' },
  ], [liquidity]);

  const haircutData = useMemo(() => (liquidity.haircut || []).map((item) => ({
    label: item.label,
    value: `${item.value}%`,
  })), [liquidity.haircut]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <LiquiditySettingsCard 
          autoLiquidity={liquidity.autoLiquidity} 
          utilization={liquidity.utilization} 
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <SummaryCard title="Exposure Limits" data={exposureLimits} />
      </Grid>

      <Grid item xs={12} md={4}>
        <SummaryCard title="Haircut Table" data={haircutData} />
      </Grid>
    </Grid>
  );
}



MerchantDetailsLiquidityView.propTypes = {
  merchant: PropTypes.object,
};

// ----------------------------------------------------------------------

function LiquiditySettingsCard({ autoLiquidity, utilization }) {
  const [enabled, setEnabled] = useState(autoLiquidity);

  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Liquidity Settings
      </Typography>

      <Stack spacing={3}>
        <FormControlLabel
          control={
            <Switch 
              checked={enabled} 
              onChange={(e) => setEnabled(e.target.checked)} 
              color="primary"
            />
          }
          label="Auto Liquidity"
          labelPlacement="start"
          sx={{ width: 1, justifyContent: 'space-between', m: 0 }}
        />

        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Merchant Utilization
            </Typography>
            <Typography variant="subtitle2" sx={{ color: 'primary.main' }}>
              {utilization}%
            </Typography>
          </Stack>
          
          <LinearProgress 
            variant="determinate" 
            value={utilization} 
            sx={{ 
              height: 8, 
              borderRadius: 1,
              bgcolor: (theme) => theme.palette.divider 
            }} 
          />
        </Stack>
      </Stack>
    </Card>
  );
}

LiquiditySettingsCard.propTypes = {
  autoLiquidity: PropTypes.bool,
  utilization: PropTypes.number,
};

// ----------------------------------------------------------------------

function HaircutTableCard({ data }) {
  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Haircut Table
      </Typography>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>Day</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>Percentage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.label}>
                <TableCell sx={{ fontWeight: 600 }}>{row.label}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {row.value}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

HaircutTableCard.propTypes = {
  data: PropTypes.array,
};
