import PropTypes from 'prop-types';
// @muiimport Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

export default function NetworkRiskAssessmentView({ assessment }) {
    const { linkedEntities, description, title } = assessment;

    return (
        <>
            <Typography variant="h6" sx={{ mb: 3 }}>
                {title}
            </Typography>

            <Card
                sx={{
                    p: 3,
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    minHeight: 460,
                }}
            >

                <Box
                    sx={{
                        width: 128,
                        height: 128,
                        borderRadius: '50%',
                        border: (theme) => `2px solid ${theme.palette.primary.main}`,
                        bgcolor: (theme) => theme.palette.primary.light,
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h2" sx={{ color: 'inherit', fontWeight: 500 }}>
                        {linkedEntities}
                    </Typography>
                </Box>

                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>

            </Card>
        </>
    );
}

NetworkRiskAssessmentView.propTypes = {
    assessment: PropTypes.object,
};


