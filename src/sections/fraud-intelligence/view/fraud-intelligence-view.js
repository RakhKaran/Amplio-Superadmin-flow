// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { SummaryDashboardGrid } from 'src/components/summary-card';
import { farudHeatmap, fraudAlertsData, networkAnalysisData, summeryData } from 'src/_mock/_fraudIntelligence';
import { Box, Stack, Typography } from '@mui/material';
import FraudHeatmapCard from '../fraud-heatmap-card';
import NetworkRiskAssessmentView from '../network-analysis';
import FraudAlertListView from '../fraud-alerts/view/fraud-alerts-list-view';



// ----------------------------------------------------------------------

export default function FraudIntelligenceView() {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Fraud Intelligence"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Fraud Intelligence' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {summeryData.map((item) => (
                    <Grid key={item.id} xs={12} sm={4}>
                        <SummaryDashboardGrid
                            title={item.title}
                            value={`₹${item.value}`}
                            icon={item.icon}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>

                <Grid xs={12} md={6}>
                    <Stack spacing={3}>
                        <Typography variant="h6">Fraud Heatmap</Typography>
                        <Grid container spacing={3}>
                            {farudHeatmap.map((account) => (
                                <Grid key={account.id} xs={12}>
                                    <FraudHeatmapCard account={account} />
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </Grid>


                <Grid xs={12} md={6}>
                    <NetworkRiskAssessmentView assessment={networkAnalysisData} />
                </Grid>



                <Grid xs={12}>
                    <Box mt={4}>
                        <FraudAlertListView fraudAlertsData={fraudAlertsData} />
                    </Box>
                </Grid>

            </Grid>

        </Container>
    );
}
