import { Card, Typography, Stack, Box, Grid, Chip, Tooltip } from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';

export default function InvestorEscrowDetails({ escrow }) {
    const data = escrow?.escrowAccount;

    if (!data) return null;

    return (
        <Card sx={{ p: 3, borderRadius: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>

                <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(99,102,241,0.15)',
                        }}
                    >
                        <Iconify icon="solar:shield-check-bold" />
                    </Box>

                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {data.accountName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Managed by {data.managedBy} as Escrow Agent
                        </Typography>
                    </Box>
                </Stack>

                <Label color="success">{data.status}</Label>
            </Stack>

            <Grid container spacing={2} sx={{ mb: 3 }}>

                <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(99,102,241,0.1)' }}>
                        <Tooltip title='Total Funds in Escrow'>
                            <Typography variant="body2" sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>Total Funds in Escrow</Typography>
                        </Tooltip>
                        <Typography variant="h6">₹{data.totalFunds} Cr</Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(59,130,246,0.1)' }}>
                        <Typography variant="body2">Allocated to PTCs</Typography>
                        <Typography variant="h6" color="primary.main">
                            ₹{data.allocatedToPTC} Cr
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Box sx={{ p: 2, borderRadius: 2, background: 'rgba(16,185,129,0.1)' }}>
                        <Typography variant="body2">Available in Escrow</Typography>
                        <Typography variant="h6" color="success.main">
                            ₹{data.availableFunds} Cr
                        </Typography>
                    </Box>
                </Grid>

            </Grid>

            <Box
                sx={{
                    p: 2.5,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.04)',
                }}
            >
                <Grid container spacing={2}>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                            Escrow Account Number
                        </Typography>
                        <Typography variant="body1">
                            {data.escrowAccountNumber}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                            Escrow Bank
                        </Typography>
                        <Typography variant="body1">
                            {data.escrowBank}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                            Escrow IFSC
                        </Typography>
                        <Typography variant="body1">
                            {data.escrowIFSC}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="caption" color="text.secondary">
                            Setup Date
                        </Typography>
                        <Typography variant="body1">
                            {data.setupDate}
                        </Typography>
                    </Grid>

                </Grid>
            </Box>

        </Card>
    );
}