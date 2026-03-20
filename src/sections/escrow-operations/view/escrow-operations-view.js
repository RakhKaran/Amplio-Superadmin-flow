// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
// data
import { escrowAccounts, waterfallSteps, settlementMismatches } from 'src/assets/data/escrowData';
// sections
import EscrowAccountCard from '../escrow-account-card';
import WaterfallEngine from '../waterfall-engine';
import SettlementMismatches from '../settlement-mismatches';

// ----------------------------------------------------------------------

export default function EscrowOperationsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Escrow Operations"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Escrow Operations' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Grid container spacing={3}>
        {/* Real-Time Escrow Monitor (LEFT) */}
        <Grid xs={12} md={6}>
          <Stack spacing={3}>
            <Typography variant="h6">Real-Time Escrow Monitor</Typography>
            <Grid container spacing={3}>
              {escrowAccounts.map((account) => (
                <Grid key={account.id} xs={12} sm={6}>
                  <EscrowAccountCard account={account} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Grid>

        {/* Waterfall Engine (RIGHT) */}
        <Grid xs={12} md={6}>
          <WaterfallEngine steps={waterfallSteps} />
        </Grid>

        {/* Settlement Mismatches (BOTTOM FULL WIDTH) */}
        <Grid xs={12}>
          <SettlementMismatches mismatches={settlementMismatches} />
        </Grid>
      </Grid>
    </Container>
  );
}
