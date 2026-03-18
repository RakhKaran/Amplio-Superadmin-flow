import { useState, useCallback } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// components
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  getComparator,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
// mock
import { _pspRepaymentHistory } from 'src/_mock/_pspRepaymentHistory';
//
import PSPRepaymentHistoryRow from './psp-repayment-history-row';
import PSPRepaymentHistoryTableToolbar from './psp-repayment-history-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Repayment ID' },
  { id: 'merchantName', label: 'Merchant Name' },
  { id: 'amount', label: 'Amount' },
  { id: 'date', label: 'Date' },
  { id: 'time', label: 'Time' },
  { id: 'utr', label: 'UTR' },
  { id: 'status', label: 'Status' },
];

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function PSPRepaymentHistoryTab() {
  const table = useTable();

  const [tableData] = useState(_pspRepaymentHistory);

  const [filters, setFilters] = useState(defaultFilters);

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
    <Card>
      <PSPRepaymentHistoryTableToolbar filters={filters} onFilters={handleFilters} />

      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
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
                  <PSPRepaymentHistoryRow key={row.id} row={row} />
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
        item.merchantName.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item.id.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item.utr.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
}
