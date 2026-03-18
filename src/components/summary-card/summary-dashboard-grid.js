import PropTypes from 'prop-types';
// @mui
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Unstable_Grid2';
//
import SummaryCard from '../summary-card';

// ----------------------------------------------------------------------

export default function SummaryDashboardGrid({ cards, loading, gridSx, ...other }) {
  if (loading) {
    return (
      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ...gridSx }} {...other}>
        {[...Array(4)].map((_, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 }, ...gridSx }} {...other}>
      {cards.map((card, index) => (
        <Grid key={index} xs={12} sm={6} md={3}>
          <SummaryCard title={card.title} data={card.data} />
        </Grid>
      ))}
    </Grid>
  );
}

SummaryDashboardGrid.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      data: PropTypes.array,
    })
  ),
  gridSx: PropTypes.object,
  loading: PropTypes.bool,
};
