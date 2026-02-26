import { Card, Grid, Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import Label from 'src/components/label';

const STATUS_DISPLAY = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

export default function FinancialDetailsForm({ financial }) {

  const finacials = financial?.financialRatios
  const methods = useForm({
    defaultValues: {
      debtEquityRatio: finacials?.debtEquityRatio ?? '',
      currentRatio: finacials?.currentRatio ?? '',
      netWorth: finacials?.netWorth ?? '',
      quickRatio: finacials?.quickRatio ?? '',
      returnOnEquity: finacials?.returnOnEquity ?? '',
      returnOnAssets: finacials?.returnOnAssets ?? '',
    },
  });

  return (
    <FormProvider methods={methods}>
      <Card sx={{p:3}}>
       <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography variant="h6" fontWeight="bold">
            Financial Ratios
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
          <RHFTextField name="debtEquityRatio" label="Debt-Equity Ratio (DER)" disabled />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField name="currentRatio" label="Current Ratio" disabled />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField name="netWorth" label="Net Worth" disabled />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField name="quickRatio" label="Quick Ratio" disabled />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField name="returnOnEquity" label="Return On Equity (ROE)" disabled />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField name="returnOnAssets" label="Return On Assets (ROA)" disabled />
        </Grid>
      </Grid>
      </Card>
    </FormProvider>
  );
}
