// @mui
import Grid from '@mui/material/Unstable_Grid2';
// mock
import { aiModelPerformanceData, riskTrendData } from 'src/_mock/_riskEngine';
// components
import DefaultModelTrendCard from './default-model-trend-card';
import AiModelPerformanceCard from './ai-model-performance-card';

// ----------------------------------------------------------------------

export default function DefaultModelAndAiModel() {
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={6}>
        <DefaultModelTrendCard data={riskTrendData} />
      </Grid>

      <Grid xs={12} md={6}>
        <AiModelPerformanceCard data={aiModelPerformanceData} />
      </Grid>
    </Grid>
  );
}
