import { addYears, format } from 'date-fns';
// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//

import InvestorProfileDetails from '../investor-profiles-details';
import { useGetInvestorProfile } from 'src/api/investor-profiles';
import { useCallback, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import InvestorDocumentDetails from '../investor-document-details';
import InvestorBankPage from '../investor-bank-page';
import InvestorSignatories from '../investor-signatories';
import { useSearchParams } from 'react-router-dom';
import InvestorBankDetails from '../investor-bank-details';
import { useGetBankDetails } from 'src/api/investorKyc';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'Investor Basic Info' },
  // { value: 'details', label: 'Investor Documents' },
  { value: 'bank', label: 'Bank Details' },
  // { value: 'signatories', label: 'Signatories' },
];

export default function InvestorProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const router = useRouter();
  const { investorProfile } = useGetInvestorProfile(id);
  const userId = investorProfile?.data?.id;
  const { bankDetails, loading } = useGetBankDetails(userId);
  console.log(investorProfile);

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab || 'basic');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push({
      search: `?tab=${newValue}`,
    });
  }, []);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Investor Profile', href: paths.dashboard.investorProfiles.root },
          {
            name: investorProfile?.data?.investorName || 'Investor Profile',
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      {currentTab === 'basic' && <InvestorProfileDetails data={investorProfile} />}

      {/* {currentTab === 'details' && <InvestorDocumentDetails investorProfile={investorProfile} />} */}

      {currentTab === 'bank' && (
        <InvestorBankDetails  bank={bankDetails} />
      )}
      {/* {currentTab === 'bank' && <TrusteeBankPage investorPrifle={investorPrifle} />} */}

      {/* {currentTab === 'signatories' && <InvestorSignatories investorProfile={investorProfile} />} */}

      {/* <InvestorProfileDetails data={investorProfile} /> */}
    </Container>
  );
}
