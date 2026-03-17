import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
// sections
import ReceivableDistributionChart from '../receivable-distribution-chart';
import RecentTransactionsList from '../recent-transactions-list';

// ----------------------------------------------------------------------

export default function MerchantDetailsReceivableView({ merchant }) {
  const receivable = merchant?.receivable || { distribution: [], recentTransactions: [] };

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ReceivableDistributionChart data={receivable.distribution} />
        </Grid>

        <Grid item xs={12} md={6}>
          <RecentTransactionsList transactions={receivable.recentTransactions} />
        </Grid>
      </Grid>
    </Stack>
  );
}

MerchantDetailsReceivableView.propTypes = {
  merchant: PropTypes.object,
};
