import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFPriceField, RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label';
import axiosInstance from 'src/utils/axios';
import * as Yup from 'yup';

const STATUS_DISPLAY = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};


export default function CapitalDetails({ setPercent, setProgress, onSaved, financial }) {
  const { enqueueSnackbar } = useSnackbar();

  const currentCapitalDetails = financial?.capitalDetails

  const capitalSchema = Yup.object().shape({
    shareCapital: Yup.string().required('Share Capital is required'),
    reserveSurplus: Yup.string().required('Reserve Surplus is required'),
    netWorth: Yup.string().required('Net Worth is required'),
  });

  const defaultValues = useMemo(
    () => ({
      shareCapital: currentCapitalDetails?.shareCapital ?? '',
      reserveSurplus: currentCapitalDetails?.reserveSurplus ?? '',
      netWorth: currentCapitalDetails?.netWorth ?? '',
    }),
    [currentCapitalDetails]
  );

  const methods = useForm({
    resolver: yupResolver(capitalSchema),
    defaultValues,
  });

  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const shareCapital = watch('shareCapital');
  const reserveSurplus = watch('reserveSurplus');

  useEffect(() => {
    const total = Number(shareCapital || 0) + Number(reserveSurplus || 0);
    setValue('netWorth', total ? String(total) : '', { shouldValidate: false });
  }, [shareCapital, reserveSurplus, setValue]);

  useEffect(() => {
    let completed = 0;
    if (shareCapital) completed += 1;
    if (reserveSurplus) completed += 1;

    const completion = Math.round((completed / 2) * 100);
    setPercent?.(completion);
    setProgress?.(completion === 100);
  }, [shareCapital, reserveSurplus, setPercent, setProgress]);

  useEffect(() => {
    if (currentCapitalDetails) {
      reset(defaultValues);
      setProgress?.(true);
    }
  }, [currentCapitalDetails, reset, defaultValues, setProgress]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        capitalDetails: {
          shareCapital: Number(data.shareCapital || 0),
          reserveSurplus: Number(data.reserveSurplus || 0),
          netWorth: Number(data.netWorth || 0),
        },
      };

      await axiosInstance.patch('/business-kyc/financial-section', payload);
      setProgress?.(true);
      onSaved?.(payload.capitalDetails);
      enqueueSnackbar('Capital details submitted', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(error?.error?.message || 'Error while submitting capital details form.', {
        variant: 'error',
      });
      console.error('Error while submitting capital details form:', error);
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
            Capital Details
          </Typography>

          <Label
            color={STATUS_DISPLAY[financial?.status]?.color || 'default'}
            sx={{ px: 2, py: 1, borderRadius: 1 }}
          >
            {STATUS_DISPLAY[financial?.status]?.label || 'Unknown'}
          </Label>
        </Stack>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <RHFTextField name="shareCapital" label="Share Capital" fullWidth disabled />
          </Grid>
          <Grid item xs={12} md={1} textAlign="center">
            <Typography variant="h6" color="text.secondary">+</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <RHFTextField name="reserveSurplus" label="Reserve Surplus" fullWidth disabled />
          </Grid>
          <Grid item xs={12} md={1} textAlign="center">
            <Typography variant="h6" color="text.secondary">=</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <RHFTextField name="netWorth" label="Net Worth" fullWidth disabled />
          </Grid>
        </Grid>

        {/* <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <LoadingButton type="submit" loading={isSubmitting} variant="contained" color="primary">
              Save
            </LoadingButton>
          </Box> */}
      </Card>
    </FormProvider>
  );
}

CapitalDetails.propTypes = {
  currentCapitalDetails: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
  onSaved: PropTypes.func,
};
