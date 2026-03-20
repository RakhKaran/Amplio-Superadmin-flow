import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import { format } from 'date-fns';
import { Stack } from '@mui/material';

// ----------------------------------------------------------------------
const STATUS_DISPLAY = {
  0: { label: 'Active', color: 'success' },
  1: { label: 'inActive', color: 'warning' },
};

export default function FraudAlertTableRow({ row, selected, onEditRow, onViewRow, onSelectRow, onDeleteRow }) {
  const { alertId, merchant, reason, riskScore, status } = row;

  // const statusDisplay = STATUS_DISPLAY[Number(status)] || {
  //   label: 'Unknown',
  //   color: 'default',
  // };

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell>{alertId}</TableCell>

        <TableCell sx={{ fontWeight: 500 }}>{merchant}</TableCell>

        <TableCell>{reason}</TableCell>

        {/* Risk Score with color */}
        <TableCell
          sx={{
            color:
              riskScore >= 70
                ? 'error.main'
                : riskScore >= 50
                  ? 'warning.main'
                  : 'success.main',
            fontWeight: 600,
          }}
        >
          {riskScore}
        </TableCell>

        {/* Status */}
        <TableCell>
          <Label
            variant="soft"
            color={
              status === 'Resolved'
                ? 'success'
                : status === 'Under Review' || status === 'Investigating'
                  ? 'warning'
                  : 'default'
            }
          >
            {status}
          </Label>
        </TableCell>

        {/* Actions */}
        <TableCell>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" color="error" size="small">
              Escalate
            </Button>

            <Button variant="outlined" color="primary" size="small">
              Review
            </Button>
          </Stack>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

FraudAlertTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
