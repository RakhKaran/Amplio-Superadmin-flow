import { addYears, format } from 'date-fns';
// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
// routes
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//

import { useCallback, useState } from 'react';
import { Tab, Tabs } from '@mui/material';

import { useSearchParams } from 'react-router-dom';
import { SummaryDashboardGrid } from 'src/components/summary-card';
import { InvestorData, SummeryData } from 'src/_mock/_investor';
import InvestorEntityDetailsCard from '../investor-details-card';
import InvestorBankDetails from '../investor-bank-details';
import InvestorSignatories from '../investor-signatories';
import InvestorInvestmentCard from '../investor-investment-limit-cards';
import EscrowMainPage from '../escrow-&-recent-transactions/main';
import { PTCListView } from '../ptc-allocation/view';
import { TransactionListView } from '../transactions/view';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'KYC/KYB' },
  { value: 'bank', label: 'Bank Details' },
  { value: 'limit', label: 'Investment Limits' },
  { value: 'escrow', label: 'Wallet & Escrow' },
  { value: 'ptc', label: 'PTC Allocation' },
  { value: 'transactions', label: 'Transactions' }
];

export default function InvestorDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const [data] = useState(SummeryData);
  const [investorData] = useState(InvestorData);

  const investor = investorData.find((item) => item.id === id);

  const router = useRouter();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab || 'basic');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push({
      search: `?tab=${newValue}`,
    });
  }, [router]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Investor Profile', href: paths.dashboard.investor.list },
          { name: investor?.investorName || 'Investor Profile' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3} sx={{ mb: { xs: 3, md: 5 } }}>
        {data.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.title}>
            <SummaryDashboardGrid title={item.title} value={item.value} icon={item.icon} />
          </Grid>
        ))}
      </Grid>

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      {currentTab === 'basic' && (
        <InvestorEntityDetailsCard
          data={investor}
          onNext={() => handleChangeTab(null, 'bank')}
        />
      )}

      {currentTab === 'bank' && (
        <InvestorBankDetails
          bank={investor?.bankDetails}
          onNext={() => handleChangeTab(null, 'limit')}
        />
      )}

      {currentTab === 'limit' && (
        <InvestorInvestmentCard
          data={investor?.investmentLimits}
          onNext={() => handleChangeTab(null, 'escrow')}
        />
      )}

      {currentTab === 'escrow' && (
        <EscrowMainPage
          escrow={investor?.walletEscrow}
          transactions={investor?.transactions}
          onNext={() => handleChangeTab(null, 'ptc')}
        />
      )}

      {currentTab === 'ptc' && (
        <PTCListView
          InvestorData={investor?.ptcTransactions || []}
        />
      )}
      {currentTab === 'transactions' && (
        <TransactionListView
          transactionsData={investor?.transactions || []}
        />
      )}

      {/* {currentTab === 'signatories' && (
        <InvestorSignatories
          signatories={investor?.signatories}
        />
      )} */}
    </Container>
  );
}
