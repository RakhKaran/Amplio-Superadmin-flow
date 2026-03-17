import PropTypes from 'prop-types';
import { useCallback } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function SettlementTableToolbar({
  filters,
  onFilters,
  statusOptions,
}) {
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleFilterStatus = useCallback(
    (event) => {
      onFilters('status', event.target.value);
    },
    [onFilters]
  );

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <TextField
        fullWidth
        select
        label="Status"
        value={filters.status}
        onChange={handleFilterStatus}
        sx={{
          maxWidth: { md: 200 },
        }}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filters.name}
        onChange={handleFilterName}
        placeholder="Search Settlement ID or UTR..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}

SettlementTableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  statusOptions: PropTypes.array,
};
