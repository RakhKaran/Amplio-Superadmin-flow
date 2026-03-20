import PropTypes from 'prop-types';
import { useState, useCallback, useMemo } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
// components
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  getComparator,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
import SettlementMismatchTableRow from '../settlement-mismatch-table-row';
import SettlementMismatchTableFiltersResult from '../settlement-mismatch-table-filters-result';
import SettlementMismatchTableToolbar from '../settlement-mismatch-table-toolbar';

const TABLE_HEAD = [
  { id: 'id', label: 'ID' },
  { id: 'counterparty', label: 'Merchant Name' },
  { id: 'amount', label: 'Expected Amount' },
  { id: 'type', label: 'Received Amount' },
  { id: 'date', label: 'Difference' },
];

const defaultFilters = {
  name: '',
};

export default function SettlementMismatchListView({ mismatches = [] }) {
  const table = useTable({ defaultOrderBy: 'date' });
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: mismatches,
        comparator: getComparator(table.order, table.orderBy),
        filters,
      }),
    [filters, table.order, table.orderBy, mismatches]
  );

  const canReset = !!filters.name;
  const notFound = !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <Card sx={{ mt: 3, borderRadius: 3 }}>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Typography variant="h6">Settlement Mismatches</Typography>
      </Box>

      {/* <SettlementMismatchTableToolbar filters={filters} onFilters={handleFilters} />

      {canReset && (
        <SettlementMismatchTableFiltersResult
          filters={filters}
          onFilters={handleFilters}
          onResetFilters={handleResetFilters}
          results={dataFiltered.length}
          sx={{ p: 2.5, pt: 0 }}
        />
      )} */}

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={0}
              onSort={table.onSort}
            />

            <TableBody>
              {dataFiltered
                .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                .map((row) => (
                  <SettlementMismatchTableRow key={row.id} row={row} />
                ))}

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
        dense={table.dense}
        onChangeDense={table.onChangeDense}
      />
    </Card>
  );
}

SettlementMismatchListView.propTypes = {
  mismatches: PropTypes.array,
};

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let filteredData = stabilizedThis.map((el) => el[0]);

  if (name) {
    const searchValue = name.toLowerCase();

    filteredData = filteredData.filter(
      (item) =>
        String(item.id || '').toLowerCase().includes(searchValue) ||
        String(item.counterparty || '').toLowerCase().includes(searchValue) ||
        String(item.utr || '').toLowerCase().includes(searchValue) ||
        String(item.type || '').toLowerCase().includes(searchValue)
    );
  }

  return filteredData;
}
