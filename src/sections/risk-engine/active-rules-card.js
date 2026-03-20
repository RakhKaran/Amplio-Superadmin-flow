import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha } from '@mui/material/styles';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ActiveRulesCard({ rule }) {
  const { title, trigger, status, lastUpdated } = rule;

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: 'background.neutral',
        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Stack spacing={1.5}>

        {/* Top */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Label
              variant="soft"
              color="success"
              sx={{ fontSize: 12, height: 22 }}
            >
              Active
            </Label>

            <IconButton size="small">
              <Iconify icon="eva:settings-2-outline" width={18} />
            </IconButton>
          </Stack>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <strong>Trigger:</strong> {trigger}
          </Typography>


          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              textAlign: 'right',
            }}
          >
            Last: {lastUpdated}
          </Typography>
        </Stack>

      </Stack>
    </Card>
  );
}

ActiveRulesCard.propTypes = {
  rule: PropTypes.object,
};