import PropTypes from 'prop-types';
import { Card, Grid, Stack, Typography, Divider, Container } from '@mui/material';
import Label from 'src/components/label';
import InvestorDocumentDetails from './investor-document';

export default function InvestorEntityDetailsCard({ data }) {
  console.log('Dataaaa2a', data)
  return (
    <>
      <Card sx={{ p: 3, borderRadius: 3, mb:2 }}>
        <Typography variant="h5" color='primary' sx={{ mb: 2 }}>
          Entity Details
        </Typography>

        <Divider sx={{ mb: 3, borderStyle: 'dashed' }} />

        <Grid container spacing={4}>

          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Legal Name
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {data?.investorName}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                Category
              </Typography>

              <Label variant="soft" color="info" sx={{ width: 'fit-content' }}>
                {data?.category}
              </Label>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                PAN
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {data?.pan}
              </Typography>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={0.5}>
              <Typography variant="caption" color="text.secondary">
                CIN
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {data?.cin || '—'}
              </Typography>
            </Stack>
          </Grid>

        </Grid>
      </Card>
      <InvestorDocumentDetails investorProfile={{ data }} />
    </>
  );
}


InvestorEntityDetailsCard.propTypes = {
  data: PropTypes.object,
};