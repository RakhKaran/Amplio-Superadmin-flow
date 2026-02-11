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
import DocumentPreviewButton from 'src/components/custom-preview-button/preview-button';

// ----------------------------------------------------------------------

const statusConfig = {
  0: { label: 'Under Review', color: 'warning' },
  1: { label: 'Approved', color: 'success' },
  2: { label: 'Rejected', color: 'error' },
};

export default function AuditedFinancialsGst3bRow({ row, selected, onSelectRow, onViewRow, onEditRow }) {
  const { auditorName, auditedType, status, reportDate, file } = row;

  return (
    <TableRow hover selected={selected}>
      <TableCell>{auditorName || 'NA'}</TableCell>
      <TableCell>{auditedType || 'NA'}</TableCell>
       <TableCell>
             <DocumentPreviewButton
             fileName={file?.fileOriginalName}
             fileUrl={file?.fileUrl}
             errorMessage='File not found'
             buttonText='Preview Document'
             />
           </TableCell>
      <TableCell>
        <Label
          variant="soft"
          color={statusConfig[Number(status)]?.color || 'default'}
        >
          {statusConfig[Number(status)]?.label || 'Unknown'}
        </Label>
      </TableCell>
      <TableCell>
        <ListItemText
          primary={format(new Date(reportDate), 'dd MMM yyyy')}
          secondary={format(new Date(reportDate), 'p')}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      {/* <Tooltip title="View Events">
            <IconButton onClick={onViewRow}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip> */}
      {/* <Tooltip title="Edit" placement="top" arrow>
          <IconButton onClick={onViewRow}>
            <Iconify icon="solar:eye-bold" />
          </IconButton>
        </Tooltip> */}

    </TableRow>
  );
}

AuditedFinancialsGst3bRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};
