import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function AiModelPerformanceCard({ data }) {
  return (
    <Card sx={{ height: 1 }}>
      <CardHeader title="AI Model Performance" />

      <Stack spacing={2.5} sx={{ p: 3, pt: 1 }}>
        {data.map((model) => (
          <ModelPerformanceRow key={model.id} model={model} />
        ))}
      </Stack>
    </Card>
  );
}

AiModelPerformanceCard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
      value: PropTypes.number,
      status: PropTypes.string,
      color: PropTypes.string,
    })
  ),
};

// ----------------------------------------------------------------------

function ModelPerformanceRow({ model }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <Typography variant="subtitle1">{model.label}</Typography>

          <Chip
            label={model.status}
            color={model.color}
            size="small"
            variant="soft"
            sx={{ fontWeight: 700 }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="body2" sx={{ minWidth: 56, color: 'text.secondary' }}>
            Accuracy:
          </Typography>

          <LinearProgress
            variant="determinate"
            value={model.value}
            color={model.color}
            sx={{
              flexGrow: 1,
              height: 8,
              borderRadius: 999,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
              },
            }}
          />

          <Typography variant="body2" sx={{ minWidth: 40, fontWeight: 600, color: 'success.main' }}>
            {model.value}%
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

ModelPerformanceRow.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    label: PropTypes.string,
    value: PropTypes.number,
    status: PropTypes.string,
    color: PropTypes.string,
  }),
};
