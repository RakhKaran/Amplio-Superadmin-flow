import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';

import {
  useGetAgreement,
  useGetCompliances,
  useGetInvestmentMandates,
  useGetKycAddressDetails,
} from 'src/api/investorKyc';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFCheckbox,
  RHFCustomFileUploadBox,
  RHFRadioGroup,
  RHFSelect,
  RHFSlider,
  RHFSwitch,
  RHFTextField,
} from 'src/components/hook-form';
import DocumentPreviewButton from 'src/components/custom-preview-button/preview-button';
import MandateExpectedYield from './mandate-expected-yield';
import axiosInstance from 'src/utils/axios';
import Label from 'src/components/label';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';

function SectionCard({ title, description, children }) {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 0.5 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      {children}
    </Card>
  );
}

SectionCard.propTypes = {
  children: PropTypes.node,
  description: PropTypes.string,
  title: PropTypes.string,
};

function DetailItem({ label, value }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value || '-'}
      </Typography>
    </Stack>
  );
}

DetailItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.any,
};

function normalizeEntity(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] || null;
  if (Array.isArray(value?.data)) return value.data[0] || null;
  return value;
}

function getFirstAvailableValue(source, keys, fallback = null) {
  const matchedKey = keys.find((key) => source?.[key] !== undefined && source?.[key] !== null);
  return matchedKey ? source[matchedKey] : fallback;
}

function normalizeBooleanish(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    if (['true', 'yes', '1', 'y'].includes(normalizedValue)) return true;
    if (['false', 'no', '0', 'n'].includes(normalizedValue)) return false;
  }

  return null;
}

function normalizeOptionValue(value, options) {
  if (value === undefined || value === null || value === '') return '';

  const directMatch = options.find((option) => option.value === value);
  if (directMatch) return directMatch.value;

  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase();

    const caseInsensitiveMatch = options.find(
      (option) => String(option.value).trim().toLowerCase() === normalizedValue
    );
    if (caseInsensitiveMatch) return caseInsensitiveMatch.value;

    const labelMatch = options.find(
      (option) => String(option.label).trim().toLowerCase() === normalizedValue
    );
    if (labelMatch) return labelMatch.value;
  }

  return '';
}

function getAgreementEntity(value) {
  const normalized = normalizeEntity(value);

  if (!normalized) return null;

  return (
    normalizeEntity(
      getFirstAvailableValue(normalized, [
        'agreement',
        'platformAgreement',
        'agreementDetails',
        'agreements',
        'platformAgreements',
      ])
    ) || normalized
  );
}

function getAgreementConsentLabel(data) {
  const consentValue = getFirstAvailableValue(data, [
    'isConsent',
    'consent',
    'consentGiven',
    'hasConsent',
    'isAccepted',
    'accepted',
    'signed',
  ]);

  if (typeof consentValue === 'boolean') {
    return consentValue ? 'Yes' : 'No';
  }

  if (typeof consentValue === 'number') {
    return consentValue ? 'Yes' : 'No';
  }

  if (typeof consentValue === 'string') {
    const normalizedValue = consentValue.trim().toLowerCase();

    if (['true', 'yes', 'accepted', 'signed', '1'].includes(normalizedValue)) {
      return 'Yes';
    }

    if (['false', 'no', '0'].includes(normalizedValue)) {
      return 'No';
    }

    return consentValue;
  }

  return '-';
}

function getAgreementDocumentType(data) {
  const documentType = getFirstAvailableValue(data, [
    'businessKycDocumentType',
    'documentType',
    'agreementDocumentType',
    'platformAgreementDocumentType',
  ]);

  if (typeof documentType === 'string') return documentType;

  return (
    documentType?.name ||
    documentType?.label ||
    documentType?.documentName ||
    documentType?.title ||
    '-'
  );
}

function getAgreementFileMeta(data) {
  const file =
    getFirstAvailableValue(data, [
      'media',
      'document',
      'file',
      'agreementFile',
      'signedDocument',
      'documentsFile',
    ]) ||
    data?.businessKycDocumentType?.fileTemplate ||
    data?.documentType?.fileTemplate ||
    null;

  return {
    fileName:
      file?.fileOriginalName ||
      file?.fileName ||
      file?.name ||
      data?.fileOriginalName ||
      data?.fileName ||
      'View Agreement',
    fileUrl: file?.fileUrl || file?.url || data?.fileUrl || data?.url || null,
  };
}

const COUNTRY_OPTIONS = [
  { value: 'India', label: 'India' },
  { value: 'England', label: 'England' },
  { value: 'Europe', label: 'Europe' },
  { value: 'United States', label: 'United States' },
];

const SOURCE_FUNDS = [
  { value: 'BUSINESS_OPERATIONS', label: 'Business Operations' },
  { value: 'FUND_CORPUS', label: 'Fund corpus' },
  { value: 'TREASURY_SURPLUS', label: 'Treasury Surplus' },
  { value: 'DEBT_FINANCING', label: 'Debt Financing' },
  { value: 'FAMILY_WEALTH', label: 'Family Wealth' },
];

const PEP_OPTIONS = [
  { value: 'false', label: 'No, entity is not a PEP' },
  { value: 'true', label: 'Yes, entity or beneficial owners are PEPs' },
];

const INVEST_OPTIONS = [
  { value: 'OWN_FUNDS', label: 'No, investing with own funds' },
  { value: 'THIRD_PARTY', label: 'Yes, investing on behalf of clients/third parties' },
];

const CROSS_BORDER_OPTIONS = [
  { value: 'DOMESTIC', label: 'No, purely domestic' },
  { value: 'INTERNATIONAL', label: 'Yes, involves international transactions' },
];

const ADDRESS_STATUS_MAP = {
  0: { label: 'Pending', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

function mapComplianceToForm(data) {
  if (!data) return {};

  const taxCountry = getFirstAvailableValue(data, ['taxCountry', 'country', 'taxResidencyCountry'], '');
  const taxNumber = getFirstAvailableValue(data, ['taxNumber', 'tinNumber', 'taxIdentificationNumber'], '');
  const sourceOfFunds = getFirstAvailableValue(data, ['sourceOfFunds', 'funds'], '');
  const pepValue = getFirstAvailableValue(data, ['isPEP', 'isPep', 'pepStatus', 'pep']);
  const investmentOnBehalf = getFirstAvailableValue(data, [
    'investmentOnBehalf',
    'investingFor',
    'investOnBehalf',
  ]);
  const crossBorderFlow = getFirstAvailableValue(data, [
    'crossBorderFlow',
    'crossBorder',
    'crossBorderTransaction',
  ]);
  const riskDisclosureAccepted = getFirstAvailableValue(data, [
    'riskDisclosureAccepted',
    'riskAck1',
    'riskAcknowledgementOne',
  ]);
  const suitabilityConfirmed = getFirstAvailableValue(data, [
    'suitabilityConfirmed',
    'riskAck2',
    'riskAcknowledgementTwo',
  ]);

  return {
    country: taxCountry || '',
    tin_number: taxNumber || '',
    funds: normalizeOptionValue(sourceOfFunds, SOURCE_FUNDS),
    pep_status: normalizeBooleanish(pepValue) === null ? '' : normalizeBooleanish(pepValue) ? 'true' : 'false',
    investing_for: normalizeOptionValue(investmentOnBehalf, INVEST_OPTIONS),
    cross_border: normalizeOptionValue(crossBorderFlow, CROSS_BORDER_OPTIONS),
    risk_ack_1: normalizeBooleanish(riskDisclosureAccepted) ?? false,
    risk_ack_2: normalizeBooleanish(suitabilityConfirmed) ?? false,
  };
}

function getFirstDefinedValue(source, keys, fallback = null) {
  const matchedKey = keys.find((key) => source?.[key] !== undefined && source?.[key] !== null);
  return matchedKey ? source[matchedKey] : fallback;
}

function getAddressProof(address) {
  return address?.addressProof || address?.addressProofFile || address?.document || address?.media || null;
}

function getOverallAddressStatus(registeredAddress, correspondenceAddress) {
  const statuses = [registeredAddress?.status, correspondenceAddress?.status].filter(
    (status) => typeof status === 'number'
  );

  if (!statuses.length) return 0;
  if (statuses.includes(2)) return 2;
  if (statuses.every((status) => status === 1)) return 1;
  return 0;
}

export function InvestorAddressReadonly({ investorId }) {
  const { enqueueSnackbar } = useSnackbar();
  const { registeredAddress, correspondenceAddress, refreshAddressDetails } = useGetKycAddressDetails(investorId);
  const registered = normalizeEntity(registeredAddress) || registeredAddress;
  const correspondence = normalizeEntity(correspondenceAddress) || correspondenceAddress;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const defaultValues = useMemo(
    () => ({
      documentType: registered?.documentType || correspondence?.documentType || 'electricity_bill',
      addressProof: getAddressProof(registered) || getAddressProof(correspondence) || null,
      registeredAddressLine1: registered?.addressLineOne || '',
      registeredAddressLine2: registered?.addressLineTwo || '',
      registeredCountry: registered?.country || '',
      registeredCity: registered?.city || '',
      registeredState: registered?.state || '',
      registeredPincode: registered?.pincode || '',
      correspondenceAddressLine1: correspondence?.addressLineOne || '',
      correspondenceAddressLine2: correspondence?.addressLineTwo || '',
      correspondenceCountry: correspondence?.country || '',
      correspondenceCity: correspondence?.city || '',
      correspondenceState: correspondence?.state || '',
      correspondencePincode: correspondence?.pincode || '',
    }),
    [correspondence, registered]
  );
  const methods = useForm({ defaultValues });
  const { reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const status = useMemo(
    () => getOverallAddressStatus(registered, correspondence),
    [registered, correspondence]
  );
  const isFinalStatus = status === 1 || status === 2;

  const isSameAsRegistered =
    !!registered &&
    !!correspondence &&
    registered?.addressLineOne === correspondence?.addressLineOne &&
    registered?.addressLineTwo === correspondence?.addressLineTwo &&
    registered?.city === correspondence?.city &&
    registered?.state === correspondence?.state &&
    registered?.country === correspondence?.country &&
    String(registered?.pincode || '') === String(correspondence?.pincode || '');

  const submitVerification = async (nextStatus, reason = '') => {
    try {
      setIsSubmitting(true);

      const response = await axiosInstance.patch('/investor-profiles/address-verification', {
        investorId,
        status: nextStatus,
        reason,
      });

      enqueueSnackbar(response?.data?.message || 'Address verification updated', {
        variant: 'success',
      });
      refreshAddressDetails();
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Address verification failed', {
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = () => submitVerification(1, '');

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      enqueueSnackbar('Please enter a rejection reason', { variant: 'warning' });
      return;
    }

    await submitVerification(2, rejectReason.trim());
    setRejectOpen(false);
    setRejectReason('');
  };

  return (
    <>
    <SectionCard
      title="Address"
      description="Read-only form view of registered and correspondence address details."
    >
      {!registered && !correspondence ? (
        <Typography variant="body2" color="text.secondary">
          No address details submitted yet.
        </Typography>
      ) : (
        <FormProvider methods={methods}>
          <Stack spacing={4}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Address Details Verification</Typography>
              <Label variant="soft" color={ADDRESS_STATUS_MAP[status]?.color || 'default'}>
                {ADDRESS_STATUS_MAP[status]?.label || 'Pending'}
              </Label>
            </Stack>

            <Stack spacing={2}>
              <Typography variant="h6">Upload Address Proof</Typography>
              <Box sx={{ width: 260 }}>
                <RHFSelect name="documentType" label="Document Type" disabled>
                  <MenuItem value="electricity_bill">Electricity Bill</MenuItem>
                  <MenuItem value="lease_agreement">Lease Agreement</MenuItem>
                </RHFSelect>
              </Box>

              <RHFCustomFileUploadBox
                name="addressProof"
                label={`Upload ${
                  (defaultValues.documentType === 'electricity_bill' && 'Electricity Bill') ||
                  (defaultValues.documentType === 'lease_agreement' && 'Lease Agreement') ||
                  'Address Proof'
                }`}
                icon="mdi:file-document-outline"
                disabled
              />
            </Stack>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    sx={{ minHeight: 42 }}
                  >
                    <Typography variant="h6">Registered Address</Typography>
                    <Box sx={{ width: { xs: '100%', sm: 170 } }} />
                  </Stack>
                  <RHFTextField name="registeredAddressLine1" label="Address Line 1" disabled />
                  <RHFTextField name="registeredAddressLine2" label="Address Line 2" disabled />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <RHFTextField name="registeredCountry" label="Country" disabled />
                    <RHFTextField name="registeredCity" label="City" disabled />
                    <RHFTextField name="registeredState" label="State" disabled />
                  </Box>
                  <RHFTextField name="registeredPincode" label="Pincode" disabled />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    sx={{ minHeight: 42 }}
                  >
                    <Typography variant="h6">Correspondence Address</Typography>
                    <FormControlLabel
                      control={<Checkbox checked={isSameAsRegistered} disabled />}
                      label="Same as Registered"
                      sx={{ m: 0 }}
                    />
                  </Stack>
                  <RHFTextField name="correspondenceAddressLine1" label="Address Line 1" disabled />
                  <RHFTextField name="correspondenceAddressLine2" label="Address Line 2" disabled />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <RHFTextField name="correspondenceCountry" label="Country" disabled />
                    <RHFTextField name="correspondenceCity" label="City" disabled />
                    <RHFTextField name="correspondenceState" label="State" disabled />
                  </Box>
                  <RHFTextField name="correspondencePincode" label="Pincode" disabled />
                </Stack>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
              <Button
                variant="soft"
                color="error"
                onClick={() => setRejectOpen(true)}
                disabled={isSubmitting || isFinalStatus}
              >
                Reject
              </Button>

              <LoadingButton
                variant="soft"
                color="success"
                onClick={handleApprove}
                loading={isSubmitting}
                disabled={isFinalStatus}
              >
                Approve
              </LoadingButton>
            </Box>
          </Stack>
        </FormProvider>
      )}
    </SectionCard>
      <RejectReasonDialog
        title="Reject Address Details"
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        reason={rejectReason}
        setReason={setRejectReason}
        onSubmit={handleRejectSubmit}
      />
    </>
  );
}

InvestorAddressReadonly.propTypes = {
  investorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export function InvestorComplianceReadonly({ investorId }) {
  const { compliance } = useGetCompliances(investorId);
  const data = normalizeEntity(compliance);
  const theme = useTheme();
  const defaultValues = useMemo(() => mapComplianceToForm(data), [data]);
  const methods = useForm({
    defaultValues,
    values: defaultValues,
  });
  const { reset, watch } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Card sx={{ p: 3 }}>
      {!data ? (
        <Typography variant="body2" color="text.secondary">
          No compliance details submitted yet.
        </Typography>
      ) : (
        <FormProvider methods={methods}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" color="primary">
                Compliance & Declarations
              </Typography>
              <Typography variant="body2">
                Complete FATCA, AML/PMLA declarations and risk acknowledgements
              </Typography>
            </Box>

            <Typography variant="h6" color="primary">
              FATCA Declaration
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <RHFSelect name="country" label="Tax Residency Country" disabled>
                  {COUNTRY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Grid>

              <Grid item xs={12} md={6}>
                <RHFTextField
                  name="tin_number"
                  label="TIN / Tax Identification Number"
                  inputProps={{ style: { textTransform: 'uppercase' } }}
                  disabled
                />
              </Grid>
            </Grid>

            <Box sx={{ pointerEvents: 'none' }}>
              <RHFRadioGroup
                name="pep_status"
                label="PEP (Politically Exposed Person) Status"
                options={PEP_OPTIONS}
              />
            </Box>

            <Typography variant="h6" color="primary">
              AML / PMLA Questionnaire
            </Typography>

            <Box sx={{ pointerEvents: 'none' }}>
              <RHFRadioGroup
                name="investing_for"
                label="Are you investing on behalf of another party?"
                options={INVEST_OPTIONS}
              />
            </Box>

            <Box sx={{ pointerEvents: 'none' }}>
              <RHFRadioGroup
                name="cross_border"
                label="Does the investment involve cross-border flows?"
                options={CROSS_BORDER_OPTIONS}
              />
            </Box>

            <RHFSelect name="funds" label="Source of Funds" disabled>
              {SOURCE_FUNDS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Typography variant="h6" color="primary">
              Risk Consent
            </Typography>

            <Stack spacing={2}>
              <Box
                onClick={() => {}}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${
                    watch('risk_ack_1') ? theme.palette.primary.main : theme.palette.divider
                  }`,
                  bgcolor: watch('risk_ack_1') ? theme.palette.action.selected : 'transparent',
                }}
              >
                <RHFCheckbox name="risk_ack_1" disabled />

                <Typography variant="body2">
                  I acknowledge that I have read and understood the risk disclosure document. I
                  understand that PTC investments carry credit risk, liquidity risk, and settlement
                  risk. Past performance is not indicative of future returns.
                </Typography>
              </Box>

              <Box
                onClick={() => {}}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${
                    watch('risk_ack_2') ? theme.palette.primary.main : theme.palette.divider
                  }`,
                  bgcolor: watch('risk_ack_2') ? theme.palette.action.selected : 'transparent',
                }}
              >
                <RHFCheckbox name="risk_ack_2" disabled />

                <Typography variant="body2">
                  I confirm that PTC investments are suitable for my investment objectives, risk
                  appetite, and financial situation. I am an informed investor with requisite
                  knowledge to evaluate these instruments.
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </FormProvider>
      )}
    </Card>
  );
}

InvestorComplianceReadonly.propTypes = {
  investorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export function InvestorMandateReadonly({ investorId }) {
  const { investmentMandates } = useGetInvestmentMandates(investorId);
  const data = normalizeEntity(investmentMandates);
  const existingMandate = data;
  const defaultValues = useMemo(
    () => ({
      minInvestment: getFirstDefinedValue(
        existingMandate,
        ['minInvestment', 'minimumInvestmentAmount'],
        null
      ),
      maxExposure: getFirstDefinedValue(
        existingMandate,
        ['maxExposure', 'maximumTotalExposure'],
        null
      ),
      minTenor: getFirstDefinedValue(existingMandate, ['minTenor', 'minimumTenorDays'], null),
      maxTenor: getFirstDefinedValue(existingMandate, ['maxTenor', 'maximumTenorDays'], null),
      yield: getFirstDefinedValue(existingMandate, ['yield', 'preferredYield'], null),
      merchantExposure: getFirstDefinedValue(
        existingMandate,
        ['merchantExposure', 'maxExposureSingleMerchant'],
        null
      ),
      bankExposure: getFirstDefinedValue(
        existingMandate,
        ['bankExposure', 'maxExposureSingleBank'],
        null
      ),
      autoReinvest: getFirstDefinedValue(
        existingMandate,
        ['autoReinvest', 'autoReinvestOnMaturity'],
        true
      ),
    }),
    [existingMandate]
  );
  const methods = useForm({ defaultValues });
  const { reset, watch } = methods;
  const values = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const sliderStyle = {
    height: 8,
    '& .MuiSlider-track': {
      height: 8,
      borderRadius: 4,
    },
    '& .MuiSlider-rail': {
      height: 8,
      borderRadius: 4,
      opacity: 0.3,
    },
    '& .MuiSlider-thumb': {
      width: 20,
      height: 20,
    },
  };

  return (
    <Card sx={{ p: 3 }}>
      {!data ? (
        <Typography variant="body2" color="text.secondary">
          No investment mandate submitted yet.
        </Typography>
      ) : (
        <FormProvider methods={methods}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Typography variant="h5" color="primary">
                  Investment Mandate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure your investment preferences and risk parameters
                </Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="minInvestment"
                label="Minimum Investment Size"
                type="number"
                disabled
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                name="maxExposure"
                label="Maximum Total Exposure"
                type="number"
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="primary">
                Allowed Tenor Range
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="minTenor" label="Minimum Tenor (Days)" type="number" disabled />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField name="maxTenor" label="Maximum Tenor (Days)" type="number" disabled />
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" color="primary">
                    Preferred Yield (% p.a.)
                  </Typography>
                  <Typography color="primary" fontWeight={600}>
                    {values.yield ?? 0}%
                  </Typography>
                </Stack>

                <Stack spacing={-1.5}>
                  <RHFSlider
                    sx={sliderStyle}
                    name="yield"
                    min={6}
                    max={9}
                    step={0.1}
                    valueLabelDisplay="auto"
                    disabled
                  />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="caption" color="text.secondary">
                      6.0%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      9.0%
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Stack spacing={2}>
                <Typography variant="h6" color="primary">
                  Expected Yield vs Tenor
                </Typography>

                <MandateExpectedYield
                  chart={{
                    categories: ['1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D'],
                    series: [
                      {
                        year: '2019',
                        data: [
                          {
                            name: 'Yield',
                            data: [6.8, 7.0, 7.2, 7.5, 7.8, 8.0, 8.3, 8.5, 8.7, 8.9],
                          },
                        ],
                      },
                    ],
                  }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Card
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'primary.lighter',
                }}
              >
                <Box>
                  <Typography fontWeight={600}>Auto Reinvest on Maturity</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automatically reinvest principal and interest in new PTCs
                  </Typography>
                </Box>
                <RHFSwitch name="autoReinvest" disabled />
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" color="primary">
                Concentration Limits
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Max Exposure to Single Merchant</Typography>
                  <Typography color="primary" fontWeight={600}>
                    {values.merchantExposure ?? 0}%
                  </Typography>
                </Stack>
                <RHFSlider
                  sx={sliderStyle}
                  name="merchantExposure"
                  min={10}
                  max={50}
                  step={0.1}
                  valueLabelDisplay="auto"
                  disabled
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Max Exposure to Single Bank</Typography>
                  <Typography color="primary">{values.bankExposure ?? 0}%</Typography>
                </Stack>
                <RHFSlider
                  sx={sliderStyle}
                  name="bankExposure"
                  min={15}
                  max={60}
                  step={0.1}
                  valueLabelDisplay="auto"
                  disabled
                />
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      )}
    </Card>
  );
}

InvestorMandateReadonly.propTypes = {
  investorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export function InvestorAgreementReadonly({ investorId }) {
  const { agreements } = useGetAgreement(investorId);
  const data = getAgreementEntity(agreements);
  const agreementFile = getAgreementFileMeta(data);

  return (
    <SectionCard
      title="Platform Agreement"
      description="Read-only view of the submitted platform agreement consent and document."
    >
      {!data ? (
        <Typography variant="body2" color="text.secondary">
          No platform agreement submitted yet.
        </Typography>
      ) : (
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DetailItem label="Consent Given" value={getAgreementConsentLabel(data)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailItem label="Document Type" value={getAgreementDocumentType(data)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailItem
                label="Agreement ID"
                value={getFirstAvailableValue(data, ['id', 'agreementId', 'platformAgreementId'], '-')}
              />
            </Grid>
          </Grid>

          <Divider />

          <Stack direction="row" justifyContent="flex-start">
            <DocumentPreviewButton
              fileName={agreementFile.fileName}
              fileUrl={agreementFile.fileUrl}
              errorMessage="Agreement file not found"
              buttonText="View Agreement"
            />
          </Stack>
        </Stack>
      )}
    </SectionCard>
  );
}

InvestorAgreementReadonly.propTypes = {
  investorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
