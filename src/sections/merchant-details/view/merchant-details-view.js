import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
// @mui
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
// routes
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//
import { useGetMerchantProfile } from 'src/api/merchant-profiles';
import MerchantDetailsBasicInfo from '../merchant-details-basic-info';
import MerchantDetailsDocuments from '../merchant-details-documents';
import MerchantDetailsBank from '../merchant-details-bank';
import UbosListView from '../ubo/view/kyc-ubo-list-view';
import MerchantDetailsReceivables from '../merchant-details-receivables';
import MerchantDetailsSettlement from '../merchant-details-settlement';
import MerchantDetailsAuditTrail from '../merchant-details-audit-trail';
import { PSPListView } from '../psp/view';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'Basic Info' },
  { value: 'documents', label: 'Documents' },
  { value: 'bank', label: 'Bank Details' },
  { value: 'ubo', label: 'UBO Details' },
  { value: 'psp', label: 'PSP Details' },
  { value: 'receivables', label: 'Receivables' },
  { value: 'settlement', label: 'Settlement' },
  { value: 'audit_trail', label: 'Audit Trail' },
];

export default function MerchantDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const router = useRouter();
  const [searchParams] = useSearchParams();

  const { merchantProfile, merchantProfileLoading, refreshProfilesDetails } =
    useGetMerchantProfile(id);

  const merchantDetail = merchantProfile?.data;

  const tab = searchParams.get('tab');

  const [currentTab, setCurrentTab] = useState(tab || 'basic');

  const handleChangeTab = useCallback(
    (event, newValue) => {
      setCurrentTab(newValue);
      router.push({
        search: `?tab=${newValue}`,
      });
    },
    [router]
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Merchant Details"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Merchant Details', href: paths.dashboard.merchantDetails.root },
          { name: merchantDetail?.companyName || 'Loading...' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>

      {currentTab === 'basic' && (
        <MerchantDetailsBasicInfo
          data={merchantProfile}
          refreshProfilesDetails={refreshProfilesDetails}
        />
      )}

      {currentTab === 'documents' && <MerchantDetailsDocuments merchant={merchantDetail} />}

      {currentTab === 'bank' && <MerchantDetailsBank merchant={merchantDetail} />}

      {currentTab === 'ubo' && (
        <UbosListView 
          merchantProfile={merchantProfile} 
          percent={() => {}} 
          setActiveStepId={() => {}} 
        />
      )}

      {currentTab === 'psp' && <PSPListView merchantProfile={merchantProfile} />}

      {currentTab === 'receivables' && <MerchantDetailsReceivables merchant={merchantDetail} />}

      {currentTab === 'settlement' && <MerchantDetailsSettlement merchant={merchantDetail} />}

      {currentTab === 'audit_trail' && <MerchantDetailsAuditTrail merchant={merchantDetail} />}
    </Container>
  );
}
