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
        p: 2.5,
        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
        },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">{bankName}</Typography>
          <Label
            variant="soft"
            color={status === 'active' ? 'success' : 'default'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            LINKED PSP
          </Typography>
          <Typography variant="body2">{psp}</Typography>
        </Stack>

        <Stack direction="row" spacing={3}>
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Balance
            </Typography>
            <Typography variant="h6">{fIndianCurrency(balance)}</Typography>
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
