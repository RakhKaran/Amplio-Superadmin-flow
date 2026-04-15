import { useState, useCallback, useMemo } from 'react';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';

import { useGetTrusteeProfile } from 'src/api/trustee-profiles';
import { useGetBankDetails, useGetDocuments, useGetSignatories } from 'src/api/trusteeKyc';

import KYCCompanyDetails from '../kyc-company-details';
import KYCSignatories from '../kyc-signatories';
import TrusteeBankPage from '../bank-detail-view';
import TrusteeProfileDetails from '../trustee-profiles-details';
import { useSearchParams } from 'react-router-dom';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'Basic Info' },
  { value: 'details', label: 'Documents' },
  { value: 'bank', label: 'Bank Details' },
  { value: 'signatories', label: 'Signatories' },
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

// ----------------------------------------------------------------------

export default function TrusteeProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const { trusteeProfile, refreshProfilesDetails } = useGetTrusteeProfile(id);
  const trusteeData = trusteeProfile?.data;
  const trusteeId = trusteeData?.id;
  const { documents = [] } = useGetDocuments(trusteeId);
  const { bankDetails = [] } = useGetBankDetails(trusteeId);
  const { signatories = [] } = useGetSignatories(trusteeId);
  const router = useRouter();

  const tabStatusMap = useMemo(
    () => ({
      basic: getOverallStatus([trusteeData?.kycApplications?.status], {
        pendingValues: [0, 1],
        approvedValues: [2],
        rejectedValues: [3],
      }),
      details: getOverallStatus(documents.map((item) => item?.status)),
      bank: getOverallStatus(bankDetails.map((item) => item?.status)),
      signatories: getOverallStatus(signatories.map((item) => item?.status)),
    }),
    [bankDetails, documents, signatories, trusteeData?.kycApplications?.status]
  );

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab || 'basic');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push({ search: `?tab=${newValue}` });
  }, [router]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Trustee Profile', href: paths.dashboard.trusteeProfiles.root },
          { name: trusteeData?.legalEntityName || 'Trustee Profile' },
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
        <TrusteeProfileDetails data={trusteeData} refreshProfilesDetails={refreshProfilesDetails} />
      )}

      {currentTab === 'details' && <KYCCompanyDetails trusteeProfile={trusteeData} />}

      {currentTab === 'bank' && <TrusteeBankPage trusteeProfile={trusteeData} />}

      {currentTab === 'signatories' && <KYCSignatories trusteeProfile={trusteeData} />}
    </Container>
  );
}
