import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

const getFinancialYears = (baseDate) => {
  if (!baseDate) return [];
  const year = new Date(baseDate).getFullYear();
  return [
    { key: 'year1', startYear: year - 3, endYear: year - 2 },
    { key: 'year2', startYear: year - 2, endYear: year - 1 },
    { key: 'year3', startYear: year - 1, endYear: year },
  ];
};


const STATUS_DISPLAY = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

export default function AuditedFinancial({
  currentAuditedFinancials,
  setPercent,
  setProgress,
  onSaved,
  financial
}) {
  const { enqueueSnackbar } = useSnackbar();

  const financials = financial?.auditedFinancials


  const statements = financial?.auditedFinancials?.financialStatements || []

  const schema = Yup.object().shape({
    baseDate: Yup.date().nullable().required('Base date is required'),
    amounts: Yup.object().shape({
      year1: Yup.string().required('Amount is required'),
      year2: Yup.string().required('Amount is required'),
      year3: Yup.string().required('Amount is required'),
    }),
  });

  const defaultValues = useMemo(() => {
    const statements = financials?.financialStatements

    if (statements.length >= 3) {
      const sorted = [...statements]
        .sort((a, b) => (a.periodStartYear || 0) - (b.periodStartYear || 0))
        .slice(-3);

      const baseDate = currentAuditedFinancials?.baseDate
        ? new Date(currentAuditedFinancials.baseDate)
        : sorted[2]?.periodEndYear
          ? new Date(`${sorted[2].periodEndYear}-03-31`)
          : new Date();

      return {
        baseDate,
        amounts: {
          year1: sorted[0]?.amount ?? '',
          year2: sorted[1]?.amount ?? '',
          year3: sorted[2]?.amount ?? '',
        },
      };
    }

    return {
      baseDate: new Date(),
      amounts: {
        year1: '',
        year2: '',
        year3: '',
      },
    };
  }, [currentAuditedFinancials]);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();
  const financialYears = getFinancialYears(values.baseDate);

  useEffect(() => {
    let completed = 0;
    if (values.baseDate) completed += 1;
    if (values.amounts?.year1 !== '') completed += 1;
    if (values.amounts?.year2 !== '') completed += 1;
    if (values.amounts?.year3 !== '') completed += 1;

    const completion = Math.round((completed / 4) * 100);
    setPercent?.(completion);
    setProgress?.(completion === 100);
  }, [values, setPercent, setProgress]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const years = getFinancialYears(data.baseDate);
      const payload = {
        auditedFinancials: {
          baseDate: data.baseDate,
          financialStatements: years.map((year, idx) => ({
            periodStartYear: year.startYear,
            periodEndYear: year.endYear,
            amount: Number(data.amounts[`year${idx + 1}`] || 0),
          })),
        },
      };

      await axiosInstance.patch('/business-kyc/financial-section', payload);
      setProgress?.(true);
      onSaved?.(payload.auditedFinancials);
      enqueueSnackbar('Audited financials saved', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Failed to save audited financials', {
        variant: 'error',
      });
      console.error('Error saving audited financials:', error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{p:3}}>
          <Stack
                 direction="row"
                 alignItems="center"
                 justifyContent="space-between"
                 sx={{ mb: 2 }}
               >
                 <Typography variant="h6" fontWeight="bold">
                   Financial Details
                 </Typography>
       
                 <Label
                   color={STATUS_DISPLAY[financial?.status]?.color || 'default'}
                   sx={{ px: 2, py: 1, borderRadius: 1 }}
                 >
                   {STATUS_DISPLAY[financial?.status]?.label || 'Unknown'}
                 </Label>
               </Stack>

        <Grid container spacing={3}>
          {financialYears.map((fy, index) => (
            <Grid item xs={12} md={4} key={fy.key}>
              <RHFTextField
                name={`amounts.year${index + 1}`}
                label={`FY ${fy.startYear}-${String(fy.endYear).slice(-2)} Amount`}
                fullWidth
                disabled
              />
            </Grid>
          ))}
        </Grid>

      </Card>
    </FormProvider >
  );
}

AuditedFinancial.propTypes = {
  currentAuditedFinancials: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
  onSaved: PropTypes.func,
};
