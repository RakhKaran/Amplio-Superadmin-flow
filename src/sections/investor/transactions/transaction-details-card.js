import { Card, Grid, Stack, Typography, Box } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function TransactionDetailsCards({ transactions = [] }) {

    const summary = {
        bankToEscrow: { amount: 0, count: 0 },
        escrowToBank: { amount: 0, count: 0 },
        ptc: { amount: 0, count: 0 },
    };

    transactions.forEach((tx) => {
        if (tx.to === 'Escrow Account') {
            summary.bankToEscrow.amount += tx.amount;
            summary.bankToEscrow.count += 1;
        } else if (tx.from === 'Escrow Account' && tx.to?.includes('Bank')) {
            summary.escrowToBank.amount += tx.amount;
            summary.escrowToBank.count += 1;
        } else if (tx.to === 'Smile Wave SPV') {
            summary.ptc.amount += tx.amount;
            summary.ptc.count += 1;
        }
    });

    const cards = [
        {
            title: 'Bank to Escrow',
            value: summary.bankToEscrow.amount,
            count: summary.bankToEscrow.count,
            icon: 'mdi:arrow-bottom-left-bold',
            color: 'success.main',
            bg: 'rgba(16,185,129,0.1)',
        },
        {
            title: 'Escrow to Bank',
            value: summary.escrowToBank.amount,
            count: summary.escrowToBank.count,
            icon: 'mdi:arrow-top-right-bold',
            color: 'error.main',
            bg: 'rgba(239,68,68,0.1)',
        },
        {
            title: 'PTC Purchases',
            value: summary.ptc.amount,
            count: summary.ptc.count,
            icon: 'mdi:sync',
            color: 'primary.main',
            bg: 'rgba(59,130,246,0.1)',
        },
    ];

    return (
        <Grid container spacing={3}>
            {cards.map((card, index) => (
                <Grid item xs={12} md={4} key={index}>
                    <Card sx={{ p: 3, borderRadius: 3 }}>

                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: card.bg,
                                        color: card.color,
                                    }}
                                >
                                    <Iconify icon={card.icon} width={18} />
                                </Box>

                                <Typography variant="body2" color="text.secondary">
                                    {card.title}
                                </Typography>

                            </Stack>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    ₹{card.value} Cr
                                </Typography>

                                <Typography variant="caption" color="text.secondary">
                                    {card.count} transactions
                                </Typography>
                            </Box>
                        </Stack>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}