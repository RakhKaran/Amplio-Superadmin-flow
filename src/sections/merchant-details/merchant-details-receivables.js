import PropTypes from 'prop-types';
// @mui
import { Grid, Card, CardHeader } from '@mui/material';
// sections
import EcommerceYearlySales from '../overview/e-commerce/ecommerce-yearly-sales';

// ----------------------------------------------------------------------

export default function MerchantDetailsReceivables({ merchant }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <EcommerceYearlySales
          title="Receivables"
          subheader="Yearly Sales Overview"
          chart={merchant?.receivables || {
            categories: [],
            series: []
          }}
        />
      </Grid>
    </Grid>
  );
}

MerchantDetailsReceivables.propTypes = {
  merchant: PropTypes.object,
};
