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


import CompanyProfileDetails from '../company-profiles-details';
import { useGetCompanyProfile } from 'src/api/company-profiles';
import { useCallback, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import CompanyDocumentDetails from '../company-document-details';
import CompanyBankPage from '../company-bank-page';
import CompanySignatories from '../company-signatories';
import { useSearchParams } from 'react-router-dom';
import BusinessProfileDetails from '../business-profile';
import CollateralAssetsDetails from '../company-collateral-assets';
import GuarantorDetailsListView from './guarantor-details-list-view';
import AuditedFinancialsListView from './audited-financial-list-view';
import AllAuditedFinancialsDetailsView from './all-audited-financials-details-view';
import PendingVerificationForm from '../company-profiles-agreement';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'Basic Info' },
  { value: 'details', label: 'Documents' },
  { value: 'bank', label: 'Bank Details' },
  { value: 'signatories', label: 'Signatories' },
  { value: 'busienssProfile', label: 'Business Profile' },
  { value: 'auditedFinancials', label: 'Audited Financials' },
  { value: 'collateralAssets', label: 'Collateral Assets' },
  { value: 'guarantorDetails', label: 'Guarantor Details' },
  { value: 'agreement', label: 'Agreement' }
];

export default function CompanyProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const router = useRouter();
  const { companyProfile } = useGetCompanyProfile(id);
  console.log(companyProfile);

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab || 'basic');
  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push({
      search: `?tab=${newValue}`
    });
  }, []);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Seller Profile', href: paths.dashboard.companyProfiles.root },
          {
            name: companyProfile?.data?.companyName || 'Seller Profile'

          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      {currentTab === 'basic' && <CompanyProfileDetails data={companyProfile} />}

      {currentTab === 'details' && <CompanyDocumentDetails companyProfile={companyProfile} />}

      {currentTab === 'bank' && <CompanyBankPage companyProfile={companyProfile} />}
      {/* {currentTab === 'bank' && <TrusteeBankPage companyPrifle={companyPrifle} />} */}

      {currentTab === 'signatories' && <CompanySignatories companyProfile={companyProfile} />}

      {currentTab === 'busienssProfile' && <BusinessProfileDetails companyProfile={companyProfile} />}

      {currentTab === 'collateralAssets' && <CollateralAssetsDetails companyProfile={companyProfile} />}

      {currentTab === 'guarantorDetails' && <GuarantorDetailsListView companyProfile={companyProfile} />}

      {currentTab === 'auditedFinancials' && <AllAuditedFinancialsDetailsView companyProfile={companyProfile} />}

      {currentTab === 'agreement' && <PendingVerificationForm companyProfiles={companyProfile} />}
    </Container>
  );
}
