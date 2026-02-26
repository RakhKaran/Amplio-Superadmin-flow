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

const STATUS_DISPLAY = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

export default function ProfitabilityDetails({
  currentProfitabilityDetails,
  setPercent,
  setProgress,
  onSaved,
  financial
}) {
  const { enqueueSnackbar } = useSnackbar();
  const financials = financial?.profitabilityDetails

  const profitabilitySchema = Yup.object().shape({
    netProfit: Yup.string().required('Net Profit is required'),
  });

  const defaultValues = useMemo(
    () => ({
      netProfit: financials?.netProfit ?? '',
    }),
    [financials]
  );

  const methods = useForm({
    resolver: yupResolver(profitabilitySchema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const netProfit = watch('netProfit');

  useEffect(() => {
    const completion = netProfit ? 100 : 0;
    setPercent?.(completion);
    setProgress?.(completion === 100);
  }, [netProfit, setPercent, setProgress]);

  useEffect(() => {
    if (currentProfitabilityDetails) {
      reset(defaultValues);
      setProgress?.(true);
    }
  }, [currentProfitabilityDetails, reset, defaultValues, setProgress]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        profitabilityDetails: {
          netProfit: Number(data.netProfit || 0),
        },
      };

      await axiosInstance.patch('/business-kyc/financial-section', payload);
      setProgress?.(true);
      onSaved?.(payload.profitabilityDetails);
      enqueueSnackbar('Profitability details submitted', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Error while submitting profitability details.', {
        variant: 'error',
      });
      console.error('Error while submitting profitability details:', error);
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
          <Typography variant="h6" fontWeight="bold">
            Profitability Details
          </Typography>

          <Label
            color={STATUS_DISPLAY[financial?.status]?.color || 'default'}
            sx={{ px: 2, py: 1, borderRadius: 1 }}
          >
            {STATUS_DISPLAY[financial?.status]?.label || 'Unknown'}
          </Label>
        </Stack>


        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <RHFTextField name="netProfit" label="Net Profit" fullWidth disabled />
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}

ProfitabilityDetails.propTypes = {
  currentProfitabilityDetails: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
  onSaved: PropTypes.func,
};
