import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Divider, Grid, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

const STATUS_DISPLAY = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

export default function FundPosition({ currentFundPosition, setPercent, setProgress, onSaved, financial }) {
  const { enqueueSnackbar } = useSnackbar();

  const financials = financial?.fundPosition

  const schema = Yup.object().shape({
    cashAndBankBalance: Yup.string().required('Cash and bank balance is required'),
    cashAndBankBalanceDate: Yup.date().nullable().required('Date is required'),
    inventoryAmount: Yup.string().required('Inventory is required'),
    prepaidExpensesAmount: Yup.string().required('Prepaid expenses is required'),
    otherCurrentAssetsAmount: Yup.string().required('Other current assets is required'),
    currentAssets: Yup.string().required('Current assets is required'),
    quickAssets: Yup.string().required('Quick assets is required'),
    totalAssets: Yup.string().required('Total assets is required'),
    currentLiabilitiesAmount: Yup.string().required('Current liabilities is required'),
    currentAssetsAndLiabilitiesDate: Yup.date().nullable().required('Date is required'),
  });

  const defaultValues = useMemo(
    () => ({
      cashAndBankBalance: financials?.cashAndBankBalance ?? '',
      cashAndBankBalanceDate: financials?.cashAndBankBalanceDate
        ? new Date(financials.cashAndBankBalanceDate)
        : null,
      inventoryAmount: financials?.inventoryAmount ?? '',
      prepaidExpensesAmount: financials?.prepaidExpensesAmount ?? '',
      otherCurrentAssetsAmount: financials?.otherCurrentAssetsAmount ?? '',
      currentAssets: financials?.currentAssets ?? '',
      quickAssets: financials?.quickAssets ?? '',
      totalAssets: financials?.totalAssets ?? '',
      currentLiabilitiesAmount: financials?.currentLiabilitiesAmount ?? '',
      currentAssetsAndLiabilitiesDate: financials?.currentAssetsAndLiabilitiesDate
        ? new Date(financials.currentAssetsAndLiabilitiesDate)
        : null,
    }),
    [financials]
  );

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    watch,
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    const cash = parseFloat(values.cashAndBankBalance || 0);
    const inventory = parseFloat(values.inventoryAmount || 0);
    const prepaid = parseFloat(values.prepaidExpensesAmount || 0);
    const other = parseFloat(values.otherCurrentAssetsAmount || 0);

    if (
      !values.cashAndBankBalance &&
      !values.inventoryAmount &&
      !values.prepaidExpensesAmount &&
      !values.otherCurrentAssetsAmount
    ) {
      setValue('currentAssets', '');
      setValue('quickAssets', '');
      setValue('totalAssets', '');
      return;
    }

    const currentAssets = cash + inventory + prepaid + other;
    const quickAssets = cash + other;

    setValue('currentAssets', currentAssets.toFixed(2), { shouldValidate: false });
    setValue('quickAssets', quickAssets.toFixed(2), { shouldValidate: false });
    setValue('totalAssets', currentAssets.toFixed(2), { shouldValidate: false });
  }, [
    values.cashAndBankBalance,
    values.inventoryAmount,
    values.prepaidExpensesAmount,
    values.otherCurrentAssetsAmount,
    setValue,
  ]);

  useEffect(() => {
    let completed = 0;
    if (values.cashAndBankBalance) completed += 1;
    if (values.cashAndBankBalanceDate) completed += 1;
    if (values.inventoryAmount) completed += 1;
    if (values.prepaidExpensesAmount) completed += 1;
    if (values.otherCurrentAssetsAmount) completed += 1;
    if (values.currentAssets) completed += 1;
    if (values.quickAssets) completed += 1;
    if (values.totalAssets) completed += 1;
    if (values.currentLiabilitiesAmount) completed += 1;
    if (values.currentAssetsAndLiabilitiesDate) completed += 1;

    const completion = Math.round((completed / 10) * 100);
    setPercent?.(completion);
    setProgress?.(completion === 100);
  }, [values, setPercent, setProgress]);

  useEffect(() => {
    if (currentFundPosition) {
      reset(defaultValues);
      setProgress?.(true);
    }
  }, [currentFundPosition, defaultValues, reset, setProgress]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        fundPosition: {
          cashAndBankBalance: Number(data.cashAndBankBalance || 0),
          cashAndBankBalanceDate: data.cashAndBankBalanceDate,
          inventoryAmount: Number(data.inventoryAmount || 0),
          prepaidExpensesAmount: Number(data.prepaidExpensesAmount || 0),
          otherCurrentAssetsAmount: Number(data.otherCurrentAssetsAmount || 0),
          currentAssets: Number(data.currentAssets || 0),
          quickAssets: Number(data.quickAssets || 0),
          totalAssets: Number(data.totalAssets || 0),
          currentLiabilitiesAmount: Number(data.currentLiabilitiesAmount || 0),
          currentAssetsAndLiabilitiesDate: data.currentAssetsAndLiabilitiesDate,
        },
      };

      await axiosInstance.patch('/business-kyc/financial-section', payload);
      setProgress?.(true);
      onSaved?.(payload.fundPosition);
      enqueueSnackbar('Fund position saved', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Error while saving fund position', {
        variant: 'error',
      });
      console.error('Error while saving fund position:', error);
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography variant="h5" fontWeight="bold">
            Fund Position
          </Typography>

          <Label
            color={STATUS_DISPLAY[financial?.status]?.color || 'default'}
            sx={{ px: 2, py: 1, borderRadius: 1 }}
          >
            {STATUS_DISPLAY[financial?.status]?.label || 'Unknown'}
          </Label>
        </Stack>
        <Grid container spacing={3} sx={{mb:2}}>
          <Grid item xs={12} md={6}>
            <RHFTextField name="cashAndBankBalance" label="Cash and Bank Balance" fullWidth disabled />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="cashAndBankBalanceDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  disabled
                  label="Cash and Bank Balance Date"
                  value={field.value ? (field.value instanceof Date ? field.value : new Date(field.value)) : null}
                  onChange={(newValue) => field.onChange(newValue)}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <RHFTextField name="inventoryAmount" label="Inventory" fullWidth disabled />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFTextField name="prepaidExpensesAmount" label="Prepaid Expenses" fullWidth disabled />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFTextField name="otherCurrentAssetsAmount" label="Other Current Assets" fullWidth disabled />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFTextField name="currentAssets" label="Current Assets" fullWidth disabled />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFTextField name="quickAssets" label="Quick Assets" fullWidth disabled />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFTextField name="totalAssets" label="Total Assets" fullWidth disabled />
          </Grid>

          <Grid item xs={12} md={4}>
            <RHFTextField name="currentLiabilitiesAmount" label="Current Liabilities" fullWidth disabled />
          </Grid>

          <Grid item xs={12} md={4}>
            <Controller
              name="currentAssetsAndLiabilitiesDate"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  disabled
                  label="Current Assets and Liabilities Date"
                  value={field.value ? (field.value instanceof Date ? field.value : new Date(field.value)) : null}
                  onChange={(newValue) => field.onChange(newValue)}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}

FundPosition.propTypes = {
  currentFundPosition: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
  onSaved: PropTypes.func,
};
