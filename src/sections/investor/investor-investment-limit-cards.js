import PropTypes from 'prop-types';
import { Card, Stack, Typography, Box } from '@mui/material';

export default function InvestmentLimitsCard({ data }) {

  const formattedData = data
    ? [
        {
          label: 'Maximum Exposure',
          value: `₹${data.maximumExposure} Cr`,
        },
        {
          label: 'Current Exposure',
          value: `₹${data.currentExposure} Cr`,
          color: 'primary',
        },
        {
          label: 'Available',
          value: `₹${data.available} Cr`,
          color: 'success',
        },
      ]
    : [];

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h5" color='primary' sx={{ mb: 3 }}>
        Investment Limits
      </Typography>

      <Stack spacing={2}>
        {formattedData.map((item, index) => (
          <Box
            key={index}
            sx={{
              p: 2.5,
              borderRadius: 2,
              background: (theme) =>
                `linear-gradient(90deg, 
                ${theme.palette.background.neutral} 0%, 
                ${theme.palette.background.paper} 100%)`,
              border: (theme) => `1px solid ${theme.palette.divider}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {item.label}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: item.color
                  ? (theme) => theme.palette[item.color].main
                  : 'text.primary',
              }}
            >
              {item.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

InvestmentLimitsCard.propTypes = {
  data: PropTypes.object,
};