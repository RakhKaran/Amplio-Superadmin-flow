import PropTypes from 'prop-types';
// @mui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
// components
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function RecentTransactionsList({ transactions }) {
  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Recent Transactions
      </Typography>

      <Stack spacing={2}>
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </Stack>
    </Card>
  );
}

RecentTransactionsList.propTypes = {
  transactions: PropTypes.array,
};

// ----------------------------------------------------------------------

function TransactionItem({ transaction }) {
  const { id, type, date, amount, status } = transaction;

  return (
    <ListItemButton
      sx={{
        p: 2,
        borderRadius: 1.5,
        border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          {id}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {type} • {date}
        </Typography>
      </Stack>

      <Stack spacing={1} alignItems="flex-end">
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          ₹{amount}L
        </Typography>
        <Label
          variant="soft"
          color={(status === 'Assigned' && 'success') || (status === 'Pending' && 'warning') || 'default'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </Stack>
    </ListItemButton>
  );
}

TransactionItem.propTypes = {
  transaction: PropTypes.object,
};
