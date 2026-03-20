import PropTypes from 'prop-types';
// @mui
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
// components
import Label from 'src/components/label';
// utils
import { fIndianCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function EscrowAccountCard({ account }) {
  const { bankName, psp, balance, inflow, status } = account;

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
            <Typography variant="subtitle1">{bankName}</Typography>

            <Stack direction="row" spacing={1}>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontWeight: 600 }}
              >
                LINKED PSP
              </Typography>

              <Typography variant="caption" sx={{ color: 'primary.main' }}>
                {psp}
              </Typography>
            </Stack>
          </Stack>

          <Label
            variant="soft"
            color={status === 'active' ? 'success' : 'default'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </Stack>

        {/* Bottom Row */}
        <Stack direction="row" spacing={15}>
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Balance
            </Typography>
            <Typography variant="h6">
              {fIndianCurrency(balance)}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Today's Inflow
            </Typography>
            <Typography variant="h6" sx={{ color: 'success.main' }}>
              {fIndianCurrency(inflow)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

EscrowAccountCard.propTypes = {
  account: PropTypes.object,
};
