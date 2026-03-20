// @mui
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
// routes
import { paths } from 'src/routes/paths';
// components
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import { SummaryDashboardGrid } from 'src/components/summary-card';
import { activeRules, summeryData } from 'src/_mock/_riskEngine';
import DefaultModelAndAiModel from 'src/sections/risk-engine/default-model-and-ai-model';
import ActiveRulesCard from '../active-rules-card';
import { Card, Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function RiskEngineView() {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CustomBreadcrumbs
                heading="Risk Engine"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    { name: 'Risk Engine' },
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

            <DefaultModelAndAiModel />

            <Card sx={{
                p: 3,
                 mt: 2
            }} >

                <Typography variant="h6" sx={{ mb: 2 }}>
                    Active Rules
                </Typography>

                <Stack spacing={2}>
                    {activeRules.map((rule) => (
                        <ActiveRulesCard key={rule.id} rule={rule} />
                    ))}
                </Stack>
            </Card>

        </Container>
    );
}
