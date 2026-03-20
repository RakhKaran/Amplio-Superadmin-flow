import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
// components
import Chart, { useChart } from 'src/components/chart';

// ----------------------------------------------------------------------

export default function DefaultModelTrendCard({ data }) {
  const theme = useTheme();
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  const chartOptions = useChart({
    colors: ['#ff3f52'],
    chart: {
      sparkline: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    fill: {
      type: 'solid',
    },
    xaxis: {
      categories: data.map((item) => item.month),
    },
    yaxis: {
      min: 0,
      max: Number((Math.ceil(maxValue * 10) / 10).toFixed(1)),
      tickAmount: 4,
      decimalsInFloat: 1,
    },
    grid: {
      strokeDashArray: 4,
      borderColor: theme.palette.divider,
      padding: {
        left: 12,
        right: 12,
        top: 0,
        bottom: 0,
      },
    },
    markers: {
      size: 5,
      strokeWidth: 0,
      hover: {
        size: 7,
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value}`,
      },
    },
    legend: {
      show: false,
    },
  });

  const series = [
    {
      name: 'Probability',
      data: data.map((item) => item.value),
    },
  ];

  return (
    <Card sx={{ height: 1 }}>
      <CardHeader title="Default Probability Trend" />

      <Box sx={{ p: 3, pt: 1 }}>
        <Chart type="line" series={series} options={chartOptions} height={320} />
      </Box>
    </Card>
  );
}

DefaultModelTrendCard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string,
      value: PropTypes.number,
    })
  ),
};
