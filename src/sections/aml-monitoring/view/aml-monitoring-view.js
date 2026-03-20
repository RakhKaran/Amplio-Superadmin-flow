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

import { SummaryDashboardGrid } from 'src/components/summary-card';
import { amlAlertsData, complianceSummary, riskScoringTimeline, screeningSummary } from 'src/_mock/_amlMonitoring';
import RistScoreTimelineView from '../aml-risk-score-timeline';
import ScreeningSummaryView from '../aml-screening-summary-card';
import { SettlementMismatchListView } from 'src/sections/escrow-operations/settlement-mismatch/view';
import AMLAlertListView from '../aml-alerts/view/aml-alerts-list-view';

// ----------------------------------------------------------------------

export default function AmlMonitoringView() {
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
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {complianceSummary.map((item) => (
                    <Grid key={item.id} xs={12} sm={4}>
                        <SummaryDashboardGrid
                            title={item.title}
                            value={item.value}
                            icon={item.icon}
                        />
                    </Grid>
                ))}
            </Grid>


            <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                    <Stack spacing={3}>
                        <Typography variant="h6">Screening Summary</Typography>
                        <Grid container spacing={3}>
                            {screeningSummary.map((account) => (
                                <Grid key={account.id} xs={12}>
                                    <ScreeningSummaryView summary={account} />
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </Grid>
                <Grid xs={12} md={6}>
                    <Stack spacing={3}>
                        <Typography variant="h6">Risk Scoring Timeline</Typography>
                        <Grid container spacing={3}>
                            {riskScoringTimeline.map((account) => (
                                <Grid key={account.id} xs={12}>
                                    <RistScoreTimelineView account={account} />
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </Grid>


                <Grid xs={12}>
                      <AMLAlertListView amlAlertsData={amlAlertsData} />
                </Grid>
            </Grid>
        </Container>
    );
}
