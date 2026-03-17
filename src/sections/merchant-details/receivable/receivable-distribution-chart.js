import PropTypes from 'prop-types';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function ReceivableDistributionChart({ data }) {
  const theme = useTheme();

  const chartOptions = useChart({
    colors: [theme.palette.primary.main],
    chart: {
      type: 'area',
      toolbar: { show: false },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: data.map((item) => item.label),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (value) => `₹${value}L`,
      },
    },
    grid: {
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (value) => `₹${value}L`,
        title: {
          formatter: () => 'Receivable',
        },
      },
      marker: { show: false },
    },
  });

  const chartSeries = [
    {
      name: 'Distribution',
      data: data.map((item) => item.value),
    },
  ];

  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Receivable Distribution
      </Typography>

      <Chart
        type="area"
        series={chartSeries}
        options={chartOptions}
        height={320}
      />
    </Card>
  );
}

ReceivableDistributionChart.propTypes = {
  data: PropTypes.array,
};
