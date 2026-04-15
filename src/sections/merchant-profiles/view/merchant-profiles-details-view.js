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
import { useCallback, useMemo, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import MerchantProfileDetails from '../merchant-profiles-details';
import MerchantDocumentDetails from '../merchant-document-details';
import MerchantAddressVerification from '../merchant-address-verification';
import MerchantBankPage from '../bank/view/merchant-bank-page';
import UbosListView from '../ubo/view/kyc-ubo-list-view';
import { PSPListView } from '../psp/view';
import {
  useGetBankDetails,
  useGetBusinessAddressDetails,
  useGetDocuments,
  useGetPspDetails,
  useGetUboDetails,
} from 'src/api/merchant-kyc';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'Basic Info' },
  { value: 'documents', label: 'Documents' },
  { value: 'addressDetails', label: 'Address Details' },
  { value: 'bank', label: 'Bank Details' },
  { value: 'ubo', label: 'UBO Details' },
  { value: 'psp', label: 'PSP Details' },
];

function toStatusNumber(status) {
  if (typeof status === 'number') return status;
  const parsed = Number(status);
  return Number.isNaN(parsed) ? null : parsed;
}

function getOverallStatus(
  statuses,
  mapping = {
    pendingValues: [0],
    approvedValues: [1],
    rejectedValues: [2],
  }
) {
  const { pendingValues, approvedValues, rejectedValues } = mapping;
  const validValues = [...pendingValues, ...approvedValues, ...rejectedValues];

  const validStatuses = statuses
    .map(toStatusNumber)
    .filter((status) => validValues.includes(status));

  if (!validStatuses.length) return null;
  if (validStatuses.some((status) => rejectedValues.includes(status))) return 2;
  if (validStatuses.every((status) => approvedValues.includes(status))) return 1;
  return 0;
}

function getTabColor(status) {
  if (status === 1) return 'success.main';
  if (status === 2) return 'error.main';
  if (status === 0) return 'warning.main';
  return 'grey.400';
}

export default function MerchantProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const router = useRouter();
  const { merchantProfile, refreshProfilesDetails } = useGetMerchantProfile(id);
  const merchantData = merchantProfile?.data;
  const merchantId = merchantData?.id;
  const { documents = [] } = useGetDocuments(merchantId);
  const { registeredAddress, correspondenceAddress } = useGetBusinessAddressDetails(merchantId);
  const { bankDetails = [] } = useGetBankDetails(merchantId);
  const { uboDetails = [] } = useGetUboDetails(merchantId);
  const { pspDetails = [] } = useGetPspDetails(merchantId);

  const tabStatusMap = useMemo(
    () => ({
      basic: getOverallStatus([merchantData?.kycApplications?.status], {
        pendingValues: [0, 1],
        approvedValues: [2],
        rejectedValues: [3],
      }),
      documents: getOverallStatus(documents.map((item) => item?.status)),
      addressDetails: getOverallStatus([registeredAddress?.status, correspondenceAddress?.status]),
      bank: getOverallStatus(bankDetails.map((item) => item?.status)),
      ubo: getOverallStatus(uboDetails.map((item) => item?.status)),
      psp: getOverallStatus(pspDetails.map((item) => item?.status)),
    }),
    [
      bankDetails,
      correspondenceAddress?.status,
      documents,
      merchantData?.kycApplications?.status,
      pspDetails,
      registeredAddress?.status,
      uboDetails,
    ]
  );

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
            name: merchantData?.companyName || 'Merchant Profile',
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {TABS.map((tabItem) => (
          <Tab
            key={tabItem.value}
            value={tabItem.value}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                {tabItem.label}
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: getTabColor(tabStatusMap[tabItem.value]),
                  }}
                />
              </Box>
            }
          />
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
    </Container>
  );
}
