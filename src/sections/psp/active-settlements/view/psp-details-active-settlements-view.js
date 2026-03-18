import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// components
import SummaryCard from 'src/components/summary-card';
//
import PSPActiveSettlementsTab from '../psp-active-settlements-tab';

// ----------------------------------------------------------------------

const SUMMARY_DATA = [
  {
    title: 'Total Active',
    data: [{ label: 'Settlements', value: '45' }],
  },
  {
    title: 'Total Amount',
    data: [{ label: 'Current Amount', value: '₹28.2 Cr', color: 'success' }],
  },
  {
    title: 'Avg Processing Time',
    data: [{ label: 'Processing Time', value: '2.3 days', color: 'info' }],
  },
];

// ----------------------------------------------------------------------

export default function PSPDetailsActiveSettlementsView({ settlements }) {
  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {SUMMARY_DATA.map((card) => (
          <Grid key={card.title} xs={12} md={4}>
            <SummaryCard title={card.title} data={card.data} />
          </Grid>
        ))}
      </Grid>

      <PSPActiveSettlementsTab />
    </Stack>
  );
}

PSPDetailsActiveSettlementsView.propTypes = {
  settlements: PropTypes.array,
};
