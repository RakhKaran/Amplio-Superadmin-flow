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

export default function RistScoreTimelineView({ account }) {
  const { name, psp, date, score, risk } = account;
  const spvDetailsPath = getSpvDetailsPath(psp);

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
            <Typography variant="subtitle1">{name}</Typography>

            <Stack direction="row" spacing={0.5}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontWeight: 600 }}
              >
                {score}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={0.5}>
            <Label
              variant="soft"
              color={risk === 'Low' ? 'success' : 'warning'}
              sx={{ textTransform: 'capitalize' }}
            >
              {risk}
            </Label>
             <Stack direction="row" spacing={0.5}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontWeight: 600 }}
              >
                {date}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

RistScoreTimelineView.propTypes = {
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
