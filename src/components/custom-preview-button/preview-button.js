import { Button, Typography, Tooltip, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import Iconify from 'src/components/iconify';


export default function DocumentPreviewButton({
    fileUrl,
    fileName,
    errorMessage = 'File not found!',
    buttonText = 'Preview Document',
}) {
    const { enqueueSnackbar } = useSnackbar();

    const handlePreview = () => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        } else {
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    };

    if (!fileUrl) {
        return (
            <Typography color="text.secondary">
                {errorMessage}
            </Typography>
        );
    }

    return (
        <Tooltip title={fileName || buttonText} arrow>
            <Button
                variant="outlined"
                color="primary"
                onClick={handlePreview}
                startIcon={<Iconify icon="mdi:eye" />}
                sx={{
                    height : 36,
                    width : 200,
                    textTransform: 'none',
                    fontWeight: 600,
                    justifyContent: 'flex-start',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        textAlign: 'left',
                    }}
                >
                    {fileName || buttonText}
                </Box>
            </Button>
        </Tooltip>
    );
}
