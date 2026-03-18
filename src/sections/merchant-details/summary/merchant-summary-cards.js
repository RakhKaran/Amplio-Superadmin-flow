import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Grid from '@mui/material/Grid';
// components
import { SummaryDashboardGrid } from 'src/components/summary-card';
// api
import { useGetMerchantSummary } from 'src/api/merchant-summary';
// mock
import { _merchantDetailsList } from 'src/_mock/_merchantDetails';

// ----------------------------------------------------------------------

export default function MerchantSummaryCards({ merchantId }) {
  const { summary } = useGetMerchantSummary(merchantId);

  const mockMerchant = useMemo(
    () => _merchantDetailsList.find((m) => m.id === merchantId) || _merchantDetailsList[0],
    [merchantId]
  );

  const cards = summary?.data?.summaryDashboardCards || mockMerchant?.summaryDashboardCards || [];

  return (
    <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 } }}>
      {cards.map((card) => (
        <Grid item xs={12} sm={6} md={3} key={card.title}>
          <SummaryDashboardGrid title={card.title} value={card.value} icon={card.icon} />
        </Grid>
      ))}
    </Grid>
  );
}

MerchantSummaryCards.propTypes = {
  merchantId: PropTypes.string,
};
