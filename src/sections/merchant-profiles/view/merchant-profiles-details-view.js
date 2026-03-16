// @mui
import Container from '@mui/material/Container';
// routes
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hook';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
//

import { useGetMerchantProfile } from 'src/api/merchant-profiles';
import { useCallback, useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import MerchantProfileDetails from '../merchant-profiles-details';
import MerchantDocumentDetails from '../merchant-document-details';
import MerchantAddressVerification from '../merchant-address-verification';
import MerchantBankPage from '../bank/view/merchant-bank-page';
import UbosListView from '../ubo/view/kyc-ubo-list-view';
import { PSPListView } from '../psp/view';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'Basic Info' },
  { value: 'documents', label: 'Documents' },
  { value: 'addressDetails', label: 'Address Details' },
  { value: 'bank', label: 'Bank Details' },
  { value: 'ubo', label: 'UBO Details' },
  { value: 'psp', label: 'PSP Details' },
  // { value: 'signatories', label: 'Signatories' },
  // { value: 'busienssProfile', label: 'Business Profile' },
  // { value: 'auditedFinancials', label: 'Audited Financials' },
  // { value: 'financialDetails', label: 'Financial Details' },
  // { value: 'collateralAssets', label: 'Collateral Assets' },
  // { value: 'guarantorDetails', label: 'Guarantor Details' },
  // { value: 'agreement', label: 'Agreement' },
  // { value: 'rocAndDpn', label: 'ROC And DPN' },
];

export default function MerchantProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const router = useRouter();
  const { merchantProfile, refreshProfilesDetails } = useGetMerchantProfile(id);
  console.log(merchantProfile);

  const [searchParams] = useSearchParams();
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
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Merchant Profile', href: paths.dashboard.merchant.root },
          {
            // name: merchantProfile?.data?.merchantName || 'Merchant Profile',
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tab) => (
          <Tab key={tab.value} value={tab.value} label={tab.label} />
        ))}
      </Tabs>
      {currentTab === 'basic' && (
        <MerchantProfileDetails
          data={merchantProfile}
          refreshProfilesDetails={refreshProfilesDetails}
        />
      )}

      {currentTab === 'documents' && <MerchantDocumentDetails merchantProfile={merchantProfile} />}

      {currentTab === 'addressDetails' && (
        <MerchantAddressVerification merchantProfile={merchantProfile} />
      )}

      {currentTab === 'bank' && <MerchantBankPage merchantProfile={merchantProfile} />}

      {currentTab === 'ubo' && <UbosListView merchantProfile={merchantProfile} />}
      {currentTab === 'psp' && <PSPListView merchantProfile={merchantProfile} />}

      {/* {currentTab === 'signatories' && <MerchantSignatories merchantProfile={merchantProfile} />}

      {currentTab === 'busienssProfile' && <BusinessProfileDetails merchantProfile={merchantProfile} />}

      {currentTab === 'collateralAssets' && <CollateralAssetsDetails merchantProfile={merchantProfile} />}

      {currentTab === 'guarantorDetails' && <GuarantorDetailsListView merchantProfile={merchantProfile} />}

      {currentTab === 'auditedFinancials' && <AllAuditedFinancialsDetailsView merchantProfile={merchantProfile} />}

      {currentTab === 'financialDetails' && <AllFinancialDetailsView merchantProfile={merchantProfile} />}

      {currentTab === 'agreement' && <PendingVerificationForm merchantProfiles={merchantProfile} />}

      {currentTab === 'rocAndDpn' && <DpnAndRocPendingVerification merchantProfiles={merchantProfile} refreshProfilesDetails ={refreshProfilesDetails} />} */}
    </Container>
  );
}
