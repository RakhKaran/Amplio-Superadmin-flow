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


export default function BorrowingDetails({ currentBorrowingDetails, setPercent, setProgress, onSaved, financial }) {
  const { enqueueSnackbar } = useSnackbar();

  const financials = financial?.borrowingDetails
  const borrowingDetailsSchema = Yup.object().shape({
    secured: Yup.string().required('Secured is required'),
    unsecured: Yup.object().shape({
      fromPromoters: Yup.string().required('From promoters is required'),
      fromOthers: Yup.string().required('From others is required'),
    }),
    totalBorrowings: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      secured: financials?.secured ?? '',
      unsecured: {
        fromPromoters: financials?.unsecured?.fromPromoters ?? '',
        fromOthers: financials?.unsecured?.fromOthers ?? '',
      },
      totalBorrowings: financials?.totalBorrowings ?? '',
    }),
    [financials]
  );

  const methods = useForm({
    resolver: yupResolver(borrowingDetailsSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    const secured = Number(values?.secured || 0);
    const fromPromoters = Number(values?.unsecured?.fromPromoters || 0);
    const fromOthers = Number(values?.unsecured?.fromOthers || 0);
    const total = secured + fromPromoters + fromOthers;

    setValue('totalBorrowings', total ? String(total) : '', { shouldValidate: false });
  }, [values?.secured, values?.unsecured?.fromPromoters, values?.unsecured?.fromOthers, setValue]);

  useEffect(() => {
    if (currentBorrowingDetails) {
      reset(defaultValues);
      setProgress?.(true);
    }
  }, [currentBorrowingDetails, defaultValues, reset, setProgress]);

  useEffect(() => {
    let completed = 0;
    if (values?.secured) completed++;
    if (values?.unsecured?.fromPromoters) completed++;
    if (values?.unsecured?.fromOthers) completed++;

    const completion = Math.round((completed / 3) * 100);
    setPercent?.(completion);
    setProgress?.(completion === 100);
  }, [values, setPercent, setProgress]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const payload = {
        borrowingDetails: {
          secured: Number(data.secured || 0),
          unsecured: {
            fromPromoters: Number(data.unsecured?.fromPromoters || 0),
            fromOthers: Number(data.unsecured?.fromOthers || 0),
          },
          totalBorrowings: Number(data.totalBorrowings || 0),
        },
      };

      await axiosInstance.patch('/business-kyc/financial-section', payload);

      setProgress?.(true);
      onSaved?.(payload.borrowingDetails);
      enqueueSnackbar('Borrowing details saved', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(
        error?.error?.message || 'Something went wrong while saving borrowing details.',
        { variant: 'error' }
      );
      console.error('Error while updating borrowing details:', error);
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
            Borrowing Details
          </Typography>

          <Label
            color={STATUS_DISPLAY[financial?.status]?.color || 'default'}
            sx={{ px: 2, py: 1, borderRadius: 1 }}
          >
            {STATUS_DISPLAY[financial?.status]?.label || 'Unknown'}
          </Label>
        </Stack>

        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <RHFTextField name="secured" label="Secured" fullWidth disabled />
          </Grid>
          <Grid item xs={12} md={1} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              +
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <RHFTextField name="unsecured.fromPromoters" label="Unsecured - Promoters" fullWidth disabled />
          </Grid>
          <Grid item xs={12} md={1} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              +
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <RHFTextField name="unsecured.fromOthers" label="Unsecured - Others" fullWidth disabled />
          </Grid>
          <Grid item xs={12} md={1} textAlign="center">
            <Typography variant="h6" color="text.secondary">
              =
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <RHFTextField name="totalBorrowings" label="Total Borrowings" fullWidth disabled />
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  );
}

BorrowingDetails.propTypes = {
  currentBorrowingDetails: PropTypes.object,
  setPercent: PropTypes.func,
  setProgress: PropTypes.func,
  onSaved: PropTypes.func,
};
