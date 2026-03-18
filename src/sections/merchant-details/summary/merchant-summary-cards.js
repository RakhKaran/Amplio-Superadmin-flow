import PropTypes from 'prop-types';
import { useMemo } from 'react';
// components
import { SummaryDashboardGrid } from 'src/components/summary-card';
// api
import { useGetMerchantSummary } from 'src/api/merchant-summary';
// mock
import { _merchantDetailsList } from 'src/_mock/_merchantDetails';
// utils
import { fIndianCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function MerchantSummaryCards({ merchantId }) {
  const { summary, summaryLoading } = useGetMerchantSummary(merchantId);

  // Find mock data for this merchant or fallback to first one for demo purposes
  const mockMerchant = useMemo(() => 
    _merchantDetailsList.find((m) => m.id === merchantId) || _merchantDetailsList[0],
  [merchantId]);

  const dashboardData = summary?.data || mockMerchant?.summaryDashboard || {
    riskTier: 'Low',
    exposureUsage: 32,
    totalReceivables: 115000000,
    activePsps: 2,
  };

  const CARDS = [
    {
      title: 'Risk Tier',
      data: [{ label: 'Tier', value: dashboardData.riskTier, color: 'info' }],
    },
    {
      title: 'Exposure Usage',
      data: [{ label: 'Usage', value: `${dashboardData.exposureUsage}%`, color: 'warning' }],
    },
    {
      title: 'Total Receivables',
      data: [{ label: 'Value', value: fIndianCurrency(dashboardData.totalReceivables), color: 'success' }],
    },
    {
      title: 'Active PSPs',
      data: [{ label: 'Count', value: dashboardData.activePsps, color: 'primary' }],
    },
  ];

  return (
    <SummaryDashboardGrid 
      loading={summaryLoading} 
      cards={CARDS} 
    />
  );
}

MerchantSummaryCards.propTypes = {
  merchantId: PropTypes.string,
};
