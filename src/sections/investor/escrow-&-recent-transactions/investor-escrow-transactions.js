import { Card, Typography, Stack, Box } from '@mui/material';
import { format } from 'date-fns';
import Label from 'src/components/label';

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'completed':
        case 'credit':
            return 'success';
        case 'pending':
            return 'warning';
        case 'debit':
            return 'error';
        default:
            return 'default';
    }
};

export default function InvestorEscrowTransactions({ transactions }) {
    return (
        <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                Recent Escrow Transactions
            </Typography>

            <Stack spacing={2}>
                {transactions?.map((item) => (
                    <Box
                        key={item.transactionId}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            background: 'rgba(255,255,255,0.04)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >

                        <Box>
                            <Typography variant="subtitle2">
                                ₹{item.amount} Cr
                            </Typography>


                            <Typography variant="caption" color="text.secondary">
                                {item.type} - {item.transactionId}
                            </Typography>
                        </Box>

                        <Stack spacing={0.5}>
                            <Label color={getStatusColor(item.status)}>
                                {item.status}
                            </Label>

                            <Typography variant="caption" color="text.secondary">
                                {format(new Date(item.date), 'MMM d, yyyy')}
                            </Typography>
                        </Stack>
                    </Box>
                ))}
            </Stack>
        </Card>
    );
}