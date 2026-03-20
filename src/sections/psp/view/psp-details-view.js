import { useState, useCallback, useMemo } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hook';
// components
import Label from 'src/components/label';
import { SummaryDashboardGrid } from 'src/components/summary-card';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// mock
import { _pspDetails, PSP_STATUS_OPTIONS, PSP_RISK_OPTIONS } from 'src/_mock/_psp';
//
import PSPDetailsOverviewView from '../overview/view/psp-details-overview-view';
import PSPMerchantsTab from '../merchants/psp-merchants-tab';
import PSPDetailsActiveSettlementsView from '../active-settlements/view/psp-details-active-settlements-view';
import PSPDetailsRepaymentHistoryView from '../repayment-history/view/psp-details-repayment-history-view';
import PSPDetailsTransactionHistoryView from '../transaction-history/view/psp-details-transaction-history-view';
import PSPDetailsRiskAssessmentView from '../risk-assessment/view/psp-details-risk-assessment-view';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'overview', label: 'Overview' },
  { value: 'merchants', label: 'Merchants' },
  { value: 'active_settlements', label: 'Active Settlements' },
  { value: 'repayment_history', label: 'Repayment History' },
  { value: 'transaction_history', label: 'Transaction History' },
  { value: 'risk_assessment', label: 'Risk Assessment' },
];

export default function PSPDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState('overview');

  const pspData = useMemo(() => _pspDetails(id), [id]);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const statusColor = PSP_STATUS_OPTIONS.find((opt) => opt.value === pspData.status)?.color || 'default';
  const riskColor = PSP_RISK_OPTIONS.find((opt) => opt.value === pspData.riskLevel)?.color || 'default';

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <CustomBreadcrumbs
          heading={pspData.name}
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'PSP', href: paths.dashboard.psp.root },
            { name: pspData.name },
          ]}
          sx={{ mb: 0 }}
        />

        <Stack direction="row" spacing={1}>
          <Label variant="filled" color={statusColor} sx={{ textTransform: 'capitalize' }}>
            {pspData.status}
          </Label>
          <Label variant="filled" color={riskColor} sx={{ textTransform: 'capitalize' }}>
            {pspData.riskLevel} Risk
          </Label>
        </Stack>
      </Stack>

      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 } }}>
        {pspData.summaryCards.map((item) => (
          <Grid xs={12} sm={6} md={3} key={item.title}>
            <SummaryDashboardGrid title={item.title} value={item.value} icon={item.icon} />
          </Grid>
        ))}
      </Grid>

      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{ mb: { xs: 3, md: 5 } }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      {currentTab === 'overview' && <PSPDetailsOverviewView psp={pspData} />}
      {currentTab === 'merchants' && <PSPMerchantsTab />}
      {currentTab === 'active_settlements' && (
        <PSPDetailsActiveSettlementsView settlements={pspData.activeSettlements} />
      )}
      {currentTab === 'repayment_history' && (
        <PSPDetailsRepaymentHistoryView history={pspData.repaymentHistory} />
      )}
      {currentTab === 'transaction_history' && (
        <PSPDetailsTransactionHistoryView history={pspData.transactionHistory} />
      )}
      {currentTab === 'risk_assessment' && (
        <PSPDetailsRiskAssessmentView assessment={pspData.riskAssessment} />
      )}
    </Container>
  );
}
