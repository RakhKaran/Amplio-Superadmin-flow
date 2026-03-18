import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function PSPDetailsRiskAssessmentView({ assessment }) {
  const theme = useTheme();

  const { score, riskLevel, lastAssessed, factors, recentEvents } = assessment;

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: [
          { offset: 0, color: theme.palette.success.light },
          { offset: 100, color: theme.palette.success.main },
        ],
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '78%',
        },
        track: {
          margin: 0,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: 6,
            color: theme.palette.text.primary,
            fontSize: theme.typography.h4.fontSize,
          },
        },
      },
    },
  });

  // Converting 8.5/10 to 85/100 for radial bar percentage
  const chartSeries = [score * 10];

  return (
    <Grid container spacing={3}>
      {/* Overall Risk Score */}
      <Grid item xs={12} md={4}>
        <Card sx={{ p: 3, textAlign: 'center', height: 1 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Overall Risk Score
          </Typography>

          <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
            <Chart
              type="radialBar"
              series={chartSeries}
              options={chartOptions}
              width={200}
              height={200}
            />
            <Box sx={{ mt: -2, mb: 2 }}>
              <Label color="success" variant="filled" sx={{ typography: 'subtitle2' }}>
                {riskLevel}
              </Label>
            </Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Last assessed: {lastAssessed}
            </Typography>
          </Stack>
        </Card>
      </Grid>

      {/* Risk Factors */}
      <Grid item xs={12} md={8}>
        <Card sx={{ p: 3, height: 1 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Risk Factors
          </Typography>

          <Stack spacing={4}>
            {factors.map((factor) => (
              <RiskFactorRow key={factor.name} factor={factor} />
            ))}
          </Stack>
        </Card>
      </Grid>

      {/* Recent Risk Events */}
      <Grid item xs={12}>
        <Card sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Recent Risk Events
          </Typography>

          {recentEvents.length > 0 ? (
            <Stack spacing={2}>
              {/* Event rows if any */}
            </Stack>
          ) : (
            <EmptyContent
              filled
              title="No recent risk events detected"
              sx={{ py: 10 }}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  );
}

PSPDetailsRiskAssessmentView.propTypes = {
  assessment: PropTypes.object,
};

// ----------------------------------------------------------------------

function RiskFactorRow({ factor }) {
  const { name, value, status } = factor;

  const getColor = (s) => {
    if (s === 'Excellent') return 'success';
    if (s === 'Good') return 'success';
    if (s === 'Fair') return 'info';
    return 'warning';
  };

  const color = getColor(status);

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2">{name}</Typography>
          <Label 
            color={color} 
            variant="soft" 
            sx={{ height: 20, fontSize: 11, fontWeight: 'bold' }}
          >
            {status}
          </Label>
        </Stack>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {value}%
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
    name: PropTypes.string,
    value: PropTypes.number,
    status: PropTypes.string,
  }),
};
