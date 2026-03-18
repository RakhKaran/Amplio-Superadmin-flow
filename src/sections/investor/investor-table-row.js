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

// ----------------------------------------------------------------------
const STATUS_DISPLAY = {
  0: { label: 'Active', color: 'success' },
  1: { label: 'inActive', color: 'warning' },
};

export default function InvestorTableRow({ row, selected, onEditRow, onViewRow, onSelectRow, onDeleteRow }) {
  const { investorName, status, yields, totalExposure, lastFundDate, category } = row;

  const statusDisplay = STATUS_DISPLAY[Number(status)] || {
    label: 'Unknown',
    color: 'default',
  };

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>


        {/* <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={investorName} sx={{ mr: 2 }} />

          <ListItemText
            primary={investorName}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{investorName}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{category}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{totalExposure}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{yields}</TableCell>


        <TableCell>
          <Label variant="soft" color={statusDisplay.color}>
            {statusDisplay.label}
          </Label>
        </TableCell>
        <TableCell>
          <ListItemText
            primary={format(new Date(lastFundDate), 'dd MMM yyyy')}
            secondary={format(new Date(lastFundDate), 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
        </TableCell>


        <TableCell sx={{ px: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }}>
          <Tooltip title="Details" placement="top" arrow>
            <IconButton onClick={onViewRow}>
              <Iconify icon="solar:eye-bold" />
            </IconButton>
          </Tooltip>

          {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
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

InvestorTableRow.propTypes = {
  onDeleteRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
