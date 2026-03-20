import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
// components
import Label from 'src/components/label';
// routes
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
// utils
import { fIndianCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------
const statusColor = {
  Low: 'success',
  Medium: 'warning',
  High: 'error',
};

export default function FraudHeatmapCard({ account }) {
  const { state, cases, status } = account;

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
        },
      }}
    >
      <Stack spacing={2}>
        {/* Top Row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack spacing={0.5}>
            <Typography variant="subtitle1">{state}</Typography>
          </Stack>

          <Label
            variant="soft"
            color={statusColor[status]|| 'default'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </Stack>

        {/* Bottom Row */}
        <Stack direction="row" spacing={15}>

          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {cases}
          </Typography>

        </Stack>
      </Stack>
    </Card>
  );
}

FraudHeatmapCard.propTypes = {
  account: PropTypes.object,
};

// ----------------------------------------------------------------------

function getSpvDetailsPath(psp) {
  const spvNumber = psp?.match(/\d+/)?.[0];

  if (!spvNumber) {
    return paths.dashboard.spvManagement.list;
  }

  return paths.dashboard.spvManagement.details(`SPV-${spvNumber.padStart(3, '0')}`);
}
