import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function MerchantDetailsRiskView({ merchant }) {
  const theme = useTheme();

  const risk = merchant?.risk || {};
  const timeline = risk.timeline || [];
  const factors = risk.factors || [];

  const chartOptions = useChart({
    colors: [theme.palette.warning.main],
    xaxis: {
      categories: timeline.map((item) => item.month),
    },
    markers: {
      size: 6,
      strokeColors: theme.palette.background.paper,
      strokeWidth: 3,
      hover: {
        size: 8,
      },
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (value) => `${value} units`,
        title: {
          formatter: () => 'Risk Level',
        },
      },
    },
  });

  const chartSeries = [
    {
      name: 'Risk Level',
      data: timeline.map((item) => item.value),
    },
  ];

  return (
    <Grid container spacing={3}>
      {/* Risk Timeline */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Risk Timeline
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Chart
              type="line"
              series={chartSeries}
              options={chartOptions}
              height={320}
            />
          </Box>
        </Card>
      </Grid>

      {/* Risk Factors */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, height: 1 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Risk Factors
          </Typography>

          <Stack spacing={4}>
            {factors.map((factor) => (
              <RiskFactorRow key={factor.label} factor={factor} />
            ))}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}

MerchantDetailsRiskView.propTypes = {
  merchant: PropTypes.object,
};

// ----------------------------------------------------------------------

function RiskFactorRow({ factor }) {
  const { label, value, status, color } = factor;

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2">{label}</Typography>
          <Chip 
            label={status} 
            size="small" 
            color={color} 
            variant="soft" 
            sx={{ height: 20, fontSize: 11, fontWeight: 'bold' }}
          />
        </Stack>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {value}
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={value}
        color={color}
        sx={{
          height: 8,
          borderRadius: 1,
          bgcolor: (theme) => theme.palette.divider,
          '& .MuiLinearProgress-bar': {
            borderRadius: 1,
          },
        }}
      />
    </Stack>
  );
}

RiskFactorRow.propTypes = {
  factor: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.number,
    status: PropTypes.string,
    color: PropTypes.string,
  }),
};
