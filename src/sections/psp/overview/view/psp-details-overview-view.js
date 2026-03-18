import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
// components
import Chart, { useChart } from 'src/components/chart';
import SummaryCard from 'src/components/summary-card';

// ----------------------------------------------------------------------

export default function PSPDetailsOverviewView({ psp }) {
  const theme = useTheme();
  const { name, status, avgSettlementTime, lastSync, integrationType, financialSummary, settlementTrend } = psp;

  const infoData = [
    { label: 'PSP Name', value: name },
    { label: 'Status', value: status, useLabel: true, color: status === 'active' ? 'success' : 'error' },
    { label: 'Avg Settlement Time', value: avgSettlementTime },
    { label: 'Last Data Sync', value: lastSync },
    { label: 'Integration Type', value: integrationType },
  ];

  const chartOptions = useChart({
    colors: [theme.palette.primary.main],
    xaxis: {
      categories: settlementTrend.categories,
    },
    tooltip: {
      y: {
        formatter: (value) => `₹${value} Cr`,
      },
    },
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <SummaryCard title="PSP Information" data={infoData} />
      </Grid>


      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, height: 1 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Financial Summary
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Stack
                spacing={1}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
                  border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.12)}`,
                }}
              >
                <Typography variant="caption" sx={{ color: 'info.main', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Monthly Processing Volume
                </Typography>
                <Typography variant="h4" sx={{ color: 'info.darker' }}>
                  ₹{financialSummary.monthlyVolume} Cr
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack
                spacing={1}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.08),
                  border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.12)}`,
                }}
              >
                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Total Settlements (MTD)
                </Typography>
                <Typography variant="h4" sx={{ color: 'success.darker' }}>
                  ₹{financialSummary.totalSettlements} Cr
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.04),
                  border: (theme) => `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Pending Amount
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'warning.main', fontWeight: 700 }}>
                  ₹{financialSummary.pendingAmount} Cr
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.04),
                  border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                }}
              >
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                  Failed Transactions
                </Typography>
                <Typography variant="subtitle1" sx={{ color: 'error.main', fontWeight: 700 }}>
                  {financialSummary.failedTransactions}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Settlement Trend (Last 6 Months)
          </Typography>
          <Chart
            type="line"
            series={settlementTrend.series}
            options={chartOptions}
            height={364}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

PSPDetailsOverviewView.propTypes = {
  psp: PropTypes.object,
};
