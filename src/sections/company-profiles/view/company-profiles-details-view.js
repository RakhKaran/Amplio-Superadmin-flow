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
import {
  useGetAgreementDetails,
  useGetAuditedFinancialsDetails,
  useGetBankDetails,
  useGetBusinessAddressDetails,
  useGetBusinessProfiles,
  useGetCollateralAssets,
  useGetDocuments,
  useGetDpnDetails,
  useGetFinancialsDetails,
  useGetGuarantorDetails,
  useGetRocDetails,
  useGetSignatories,
} from 'src/api/companyKyc';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import CompanyDocumentDetails from '../company-document-details';
import CompanyAddressVerification from '../company-address-verification';
import CompanyBankPage from '../company-bank-page';
import CompanySignatories from '../company-signatories';
import { useSearchParams } from 'react-router-dom';
import BusinessProfileDetails from '../business-profile';
import CollateralAssetsDetails from '../company-collateral-assets';
import GuarantorDetailsListView from './guarantor-details-list-view';
import AllAuditedFinancialsDetailsView from './all-audited-financials-details-view';
import PendingVerificationForm from '../company-profiles-agreement';
import DpnAndRocPendingVerification from '../dpn-and-roc-verification';
import AllFinancialDetailsView from './all-financial-details-view';
import { useGetCompanyProfile } from 'src/api/company-profiles';

// ----------------------------------------------------------------------

const TABS = [
  { value: 'basic', label: 'Basic Info' },
  { value: 'details', label: 'Documents' },
  { value: 'addressDetails', label: 'Address Details' },
  { value: 'bank', label: 'Bank Details' },
  { value: 'signatories', label: 'Signatories' },
  { value: 'busienssProfile', label: 'Business Profile' },
  { value: 'auditedFinancials', label: 'Audited Financials' },
  { value: 'financialDetails', label: 'Financial Details' },
  { value: 'collateralAssets', label: 'Collateral Assets' },
  { value: 'guarantorDetails', label: 'Guarantor Details' },
  { value: 'agreement', label: 'Agreement' },
  { value: 'rocAndDpn', label: 'ROC And DPN' }
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

export default function CompanyProfilesDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();

  const router = useRouter();
  const { companyProfile, refreshProfilesDetails } = useGetCompanyProfile(id);
  const companyId = companyProfile?.data?.id;

  const { documents = [] } = useGetDocuments(companyId);
  const { registeredAddress, correspondenceAddress } = useGetBusinessAddressDetails(companyId);
  const { bankDetails = [] } = useGetBankDetails(companyId);
  const { signatories = [] } = useGetSignatories(companyId);
  const { businessProfile = [] } = useGetBusinessProfiles(companyId);
  const { collateralAssets = [] } = useGetCollateralAssets(companyId);
  const { guarantorDetails = [] } = useGetGuarantorDetails(companyId);
  const { agreementDetails = [] } = useGetAgreementDetails(companyId);
  const { dpnDetails = [] } = useGetDpnDetails(companyId);
  const { rocDetails = [] } = useGetRocDetails(companyId);
  const { auditedFinancials } = useGetAuditedFinancialsDetails(companyId);
  const { financialDetails = [] } = useGetFinancialsDetails(companyId);

  const tabStatusMap = useMemo(() => {
    const auditedItems = [
      ...(auditedFinancials?.financialStatements ?? []),
      ...(auditedFinancials?.incomeTaxReturns ?? []),
      ...(auditedFinancials?.gstr9 ?? []),
      ...(auditedFinancials?.gst3b ?? []),
    ];
    const safeRocDetails = toArray(rocDetails);
    const safeDpnDetails = toArray(dpnDetails);

    return {
      basic: getOverallStatus([companyProfile?.data?.kycApplications?.status], {
        pendingValues: [0, 1],
        approvedValues: [2],
        rejectedValues: [3],
      }),
      details: getOverallStatus(documents.map((item) => item?.status)),
      addressDetails: getOverallStatus([registeredAddress?.status, correspondenceAddress?.status]),
      bank: getOverallStatus(bankDetails.map((item) => item?.status)),
      signatories: getOverallStatus(signatories.map((item) => item?.status)),
      busienssProfile: getOverallStatus(businessProfile.map((item) => item?.status)),
      auditedFinancials: getOverallStatus(auditedItems.map((item) => item?.status)),
      financialDetails: getOverallStatus(
        (Array.isArray(financialDetails) ? financialDetails : [financialDetails]).map(
          (item) => item?.status
        )
      ),
      collateralAssets: getOverallStatus(collateralAssets.map((item) => item?.status)),
      guarantorDetails: getOverallStatus(guarantorDetails.map((item) => item?.status)),
      agreement: getOverallStatus(agreementDetails.map((item) => item?.status)),
      rocAndDpn: getOverallStatus([...safeRocDetails, ...safeDpnDetails].map((item) => item?.status)),
    };
  }, [
    agreementDetails,
    auditedFinancials,
    bankDetails,
    businessProfile,
    collateralAssets,
    companyProfile?.data?.kycApplications?.status,
    correspondenceAddress?.status,
    documents,
    dpnDetails,
    financialDetails,
    guarantorDetails,
    registeredAddress?.status,
    rocDetails,
    signatories,
  ]);

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [currentTab, setCurrentTab] = useState(tab || 'basic');

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflowY = html.style.overflowY;
    const prevBodyOverflowY = body.style.overflowY;

    html.style.overflowY = 'scroll';
    body.style.overflowY = 'scroll';

    return () => {
      html.style.overflowY = prevHtmlOverflowY;
      body.style.overflowY = prevBodyOverflowY;
    };
  }, []);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
    router.push({
      search: `?tab=${newValue}`
    });
  }, [router]);

  const tabContentSx = {
    '& .MuiContainer-root': {
      maxWidth: 'none !important',
      paddingLeft: '0 !important',
      paddingRight: '0 !important',
    },
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Box>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Details
        </Typography>
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
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{ mb: { xs: 3, md: 5 } }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Box display="flex" alignItems="center" gap={1}>
                  {tab.label}
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: getTabColor(tabStatusMap[tab.value]),
                    }}
                  />
                </Box>
              }
            />
          ))}
        </Tabs>
        <Box sx={tabContentSx}>
          {currentTab === 'basic' && <CompanyProfileDetails data={companyProfile} refreshProfilesDetails={refreshProfilesDetails} />}

          {currentTab === 'details' && <CompanyDocumentDetails companyProfile={companyProfile} />}

          {currentTab === 'addressDetails' && (
            <CompanyAddressVerification companyProfile={companyProfile} />
          )}

          {currentTab === 'bank' && <CompanyBankPage companyProfile={companyProfile} />}
          {/* {currentTab === 'bank' && <TrusteeBankPage companyPrifle={companyPrifle} />} */}

          {currentTab === 'signatories' && <CompanySignatories companyProfile={companyProfile} />}

          {currentTab === 'busienssProfile' && <BusinessProfileDetails companyProfile={companyProfile} />}

          {currentTab === 'collateralAssets' && <CollateralAssetsDetails companyProfile={companyProfile} />}

          {currentTab === 'guarantorDetails' && <GuarantorDetailsListView companyProfile={companyProfile} />}

          {currentTab === 'auditedFinancials' && <AllAuditedFinancialsDetailsView companyProfile={companyProfile} />}

          {currentTab === 'financialDetails' && <AllFinancialDetailsView companyProfile={companyProfile} />}

          {currentTab === 'agreement' && <PendingVerificationForm companyProfiles={companyProfile} />}

          {currentTab === 'rocAndDpn' && <DpnAndRocPendingVerification companyProfiles={companyProfile} refreshProfilesDetails={refreshProfilesDetails} />}
        </Box>
      </Box>
    </Container>
  );
}
