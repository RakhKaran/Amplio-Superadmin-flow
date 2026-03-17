import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
// @mui
import {
  Card,
  Table,
  TableBody,
  TableContainer,
  Typography,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
// components
import Scrollbar from 'src/components/scrollbar';
import Iconify from 'src/components/iconify';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
//
import AuditTrailTableRow from '../audit-trail-table-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'timestamp', label: 'Timestamp' },
  { id: 'admin', label: 'Admin' },
  { id: 'action', label: 'Action' },
  { id: 'changes', label: 'Changes' },
];

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function MerchantDetailsAuditTrailView({ merchant }) {
  const table = useTable();

  const [filters, setFilters] = useState(defaultFilters);

  const tableData = merchant?.auditTrail || [];

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [table]
  );

  const notFound = !dataFiltered.length;

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Audit Trail
      </Typography>

      <Stack sx={{ mb: 3 }}>
        <TextField
          fullWidth
          value={filters.name}
          onChange={(event) => handleFilters('name', event.target.value)}
          placeholder="Search actions or admins..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              onSort={table.onSort}
            />
            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <AuditTrailTableRow key={row.id} row={row} />
                ))}

              <TableEmptyRows
                height={72}
                emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
              />

              <TableNoData notFound={notFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={table.page}
        rowsPerPage={table.rowsPerPage}
        onPageChange={table.onChangePage}
        onRowsPerPageChange={table.onChangeRowsPerPage}
      />
    </Card>
  );
}

MerchantDetailsAuditTrailView.propTypes = {
  merchant: PropTypes.object,
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (item) =>
        item.action.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item.admin.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
