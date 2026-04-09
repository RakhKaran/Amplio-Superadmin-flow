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
import { useCallback, useEffect, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import InvestorDocumentDetails from '../investor-document-details';
import InvestorBankPage from '../investor-bank-page';
import InvestorSignatoriesApproval from '../investor-signatories-approval';
import InvestorUboApproval from '../investor-ubo-approval';
import {
  InvestorAddressReadonly,
  InvestorAgreementReadonly,
  InvestorComplianceReadonly,
  InvestorMandateReadonly,
} from '../investor-kyc-readonly-sections';
import { useSearchParams } from 'react-router-dom';

// ----------------------------------------------------------------------

const INDIVIDUAL_TABS = [
  { value: 'basic', label: 'Investor Basic Info' },
  { value: 'bank', label: 'Bank Details' },
];

const INSTITUTIONAL_TABS = [
  { value: 'basic', label: 'Investor Basic Info' },
  { value: 'documents', label: 'Documents' },
  { value: 'address', label: 'Address' },
  { value: 'bank', label: 'Bank Details' },
  { value: 'ubo', label: 'UBO Approval' },
  { value: 'signatories', label: 'Signatory Approval' },
  { value: 'compliance', label: 'Compliance & Declarations' },
  { value: 'mandate', label: 'Investment Mandate' },
  { value: 'agreement', label: 'Platform Agreement' },
];

export default function InvestorProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const router = useRouter();
  const { investorProfile, refreshInvestorProfile } = useGetInvestorProfile(id);
  const investor = investorProfile?.data || {};
  const investorId = investor?.id || id;
  const investorType = String(
    investor?.investorKycType || investor?.investorType || investor?.kycType || 'individual'
  ).toLowerCase();
  const tabs = investorType === 'institutional' ? INSTITUTIONAL_TABS : INDIVIDUAL_TABS;

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab || tabs[0].value);

  useEffect(() => {
    if (!tabs.find((item) => item.value === currentTab)) {
      setCurrentTab(tabs[0].value);
    }
  }, [currentTab, tabs]);

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
          { name: 'Investor Profile', href: paths.dashboard.investorProfiles.list },
          {
            name: investorProfile?.data?.fullName || investorProfile?.data?.companyName || 'Investor Profile',
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {tabs.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      {currentTab === 'basic' && (
        <InvestorProfileDetails
          data={investorProfile}
          onRefresh={refreshInvestorProfile}
        />
      )}

      {currentTab === 'documents' && <InvestorDocumentDetails investorProfile={investorProfile} />}

      {currentTab === 'address' && <InvestorAddressReadonly investorId={investorId} />}

      {currentTab === 'bank' && <InvestorBankPage investorProfile={investorProfile} />}

      {currentTab === 'ubo' && <InvestorUboApproval investorId={investorId} />}

      {currentTab === 'signatories' && <InvestorSignatoriesApproval investorId={investorId} />}

      {currentTab === 'compliance' && <InvestorComplianceReadonly investorId={investorId} />}

      {currentTab === 'mandate' && <InvestorMandateReadonly investorId={investorId} />}

      {currentTab === 'agreement' && <InvestorAgreementReadonly investorId={investorId} />}
    </Container>
  );
}
