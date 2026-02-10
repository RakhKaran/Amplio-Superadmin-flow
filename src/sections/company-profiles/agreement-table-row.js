import PropTypes from 'prop-types';
// @mui
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
// utils
import { format } from 'date-fns';
import { Button, IconButton, Tooltip, Typography } from '@mui/material';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

const statusConfig = {
  0: { label: 'pending', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

const verificationConfig = {
  true: { label: 'Verified', color: 'success' },
  false: { label: 'Pending', color: 'warning' },
};


export default function AgreementTableRow({ row, selected, onSelectRow, onViewRow, onEditRow }) {
  const { businessKycDocumentType, media, guarantorType, status, businessKycGuarantorVerification } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{businessKycDocumentType?.name || 'NA'}</TableCell>

      {/* <TableCell>{media?.fileName || 'NA'}</TableCell> */}
       <TableCell>
                            {/* <Button
                              variant="outlined"
                              startIcon={<Iconify icon="mdi:eye" />}
                              onClick={() => window.open(media?.fileName, '_blank')}
                            >
                              Preview
                            </Button> */}
      
                            {media?.fileUrl ? (
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  const url = media?.fileUrl;
                                  if (url) {
                                    window.open(url, '_blank');
                                  } else {
                                    enqueueSnackbar('Agreement found!', { variant: 'error' });
                                  }
                                }}
                                sx={{
                                  height: 36,
                                  textTransform: 'none',
                                  fontWeight: 600,
                                }}
                                startIcon={<Iconify icon="mdi:eye" />}
                              >
                                {media?.fileName || 'Preview Document'}
                              </Button>
                            ) : (
                              <Typography color="text.secondary">No agreement file uploaded.</Typography>
                            )}
                          </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={statusConfig[Number(status)]?.color || 'default'}
        >
          {statusConfig[Number(status)]?.label || 'Unknown'}
        </Label>
      </TableCell>

      {/* <TableCell>
  <Label
    variant="soft"
    color={verificationConfig[businessKycGuarantorVerification?.isVerified]?.color}
  >
    {verificationConfig[businessKycGuarantorVerification?.isVerified]?.label}
  </Label>
</TableCell> */}


      {/* <TableCell> */}
        {/* <Tooltip title="View Events">
            <IconButton onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip> */}
        {/* <Tooltip title="Edit" placement="top" arrow>
          <IconButton onClick={onViewRow}>
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip>
      </TableCell> */}
    </TableRow>
  );
}

AgreementTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
