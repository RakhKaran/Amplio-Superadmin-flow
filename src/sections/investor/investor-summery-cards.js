import PropTypes from 'prop-types';
import { Card, Stack, Typography, Box } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function InvestorSummaryCard({ title, value, icon }) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Stack spacing={1}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {title}
        </Typography>

        <Typography variant="h5">{value}</Typography>
      </Stack>

      <Box
        sx={{
          width: 40,
          height: 40,
          color: 'primary.main'

        }}
      >
        <Iconify icon={icon} width={24} />
      </Box>
    </Card>
  );
}

InvestorSummaryCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.any,
  icon: PropTypes.string,
};