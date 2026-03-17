import PropTypes from 'prop-types';
import { useMemo } from 'react';
// @mui
import {
  Box,
  Card,
  Grid,
  Typography,
} from '@mui/material';
// components
import EmptyContent from 'src/components/empty-content';
//
import MerchantDetailsSummaryCard from '../../common/merchant-details-summary-card';

// ----------------------------------------------------------------------

export default function MerchantDetailsFraudView({ merchant }) {
  const fraudAML = merchant?.fraudAML || {};
  const aml = fraudAML.aml || [];
  const alerts = fraudAML.alerts || [];

  const amlData = useMemo(() => aml.map((item) => ({
    label: item.label,
    value: item.status,
    color: item.color || 'success',
    useLabel: true,
  })), [aml]);

  return (
    <Grid container spacing={3}>
      {/* AML Screening */}
      <Grid item xs={12} md={6}>
        <MerchantDetailsSummaryCard title="AML Screening" data={amlData} />
      </Grid>

      {/* Fraud Alerts */}
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 3, height: 1 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Fraud Alerts
          </Typography>

          <Box
            sx={{
              height: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {alerts.length > 0 ? (
              <Box>
                {/* Map alerts if they exist in future */}
              </Box>
            ) : (
              <EmptyContent
                title="No active fraud alerts"
                imgUrl="/assets/icons/empty/ic_content.svg"
                sx={{ py: 3 }}
              />
            )}
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
}

MerchantDetailsFraudView.propTypes = {
  merchant: PropTypes.object,
};
