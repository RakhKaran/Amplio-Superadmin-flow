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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
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
import {
  useGetAgreement,
  useGetBankDetails,
  useGetCompliances,
  useGetDocuments,
  useGetInvestmentMandates,
  useGetKycAddressDetails,
  useGetSignatories,
  useGetUBOs,
} from 'src/api/investorKyc';

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

function toStatusNumber(status) {
  if (typeof status === 'number') return status;
  const parsed = Number(status);
  return Number.isNaN(parsed) ? null : parsed;
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
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

export default function InvestorProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const router = useRouter();
  const { investorProfile, refreshInvestorProfile } = useGetInvestorProfile(id);
  const investor = investorProfile?.data || {};
  const investorId = investor?.id || id;
  const { documents = [] } = useGetDocuments(investorId);
  const { bankDetails } = useGetBankDetails(investorId);
  const { ubos = [] } = useGetUBOs(investorId);
  const { registeredAddress, correspondenceAddress } = useGetKycAddressDetails(investorId);
  const { compliance } = useGetCompliances(investorId);
  const { investmentMandates } = useGetInvestmentMandates(investorId);
  const { agreements } = useGetAgreement(investorId);
  const { signatories = [] } = useGetSignatories(investorId);
  const investorType = String(
    investor?.investorKycType || investor?.investorType || investor?.kycType || 'individual'
  ).toLowerCase();
  const tabs = investorType === 'institutional' ? INSTITUTIONAL_TABS : INDIVIDUAL_TABS;

  const tabStatusMap = useMemo(
    () => ({
      basic: getOverallStatus([investor?.kycApplications?.status], {
        pendingValues: [0, 1],
        approvedValues: [2],
        rejectedValues: [3],
      }),
      documents: getOverallStatus(documents.map((item) => item?.status)),
      address: getOverallStatus([registeredAddress?.status, correspondenceAddress?.status]),
      bank: getOverallStatus(toArray(bankDetails).map((item) => item?.status)),
      ubo: getOverallStatus(ubos.map((item) => item?.status)),
      signatories: getOverallStatus(signatories.map((item) => item?.status)),
      compliance: getOverallStatus(toArray(compliance).map((item) => item?.status)),
      mandate: getOverallStatus(toArray(investmentMandates).map((item) => item?.status)),
      agreement: getOverallStatus(toArray(agreements).map((item) => item?.status)),
    }),
    [
      agreements,
      bankDetails,
      compliance,
      correspondenceAddress?.status,
      documents,
      investmentMandates,
      investor?.kycApplications?.status,
      registeredAddress?.status,
      signatories,
      ubos,
    ]
  );

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
            name: investor?.fullName || investor?.companyName || 'Investor Profile',
          },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Tabs value={currentTab} onChange={handleChangeTab} sx={{ mb: { xs: 3, md: 5 } }}>
        {tabs.map((tabItem) => (
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
        <InvestorProfileDetails data={investorProfile} onRefresh={refreshInvestorProfile} />
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
