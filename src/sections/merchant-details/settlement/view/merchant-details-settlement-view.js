import { useState, useCallback, useMemo } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
// components
import Scrollbar from 'src/components/scrollbar';
import {
  useTable,
  getComparator,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';
// utils
import { fIndianCurrency } from 'src/utils/format-number';
//
import SettlementTableRow from '../settlement-table-row';
import SettlementTableToolbar from '../settlement-table-toolbar';
import SummaryCard from 'src/components/summary-card';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Pending', label: 'Pending' },
];

const TABLE_HEAD = [
  { id: 'id', label: 'Settlement ID' },
  { id: 'date', label: 'Date' },
  { id: 'status', label: 'Status' },
  { id: 'netSettlement', label: 'Net Settlement' },
  { id: 'grossAmount', label: 'Gross Amount' },
  { id: 'd0Haircut', label: 'D0 Haircut' },
  { id: 'd1Haircut', label: 'D1 Haircut' },
  { id: 'processingFee', label: 'Fee' },
  { id: 'sourceAccount', label: 'Source' },
  { id: 'destinationAccount', label: 'Destination' },
  { id: 'transferInitiated', label: 'Initiated' },
  { id: 'creditReceived', label: 'Received' },
  { id: 'utr', label: 'UTR' },
  { id: '', label: 'Actions' },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function MerchantDetailsSettlementView({ settlements }) {
  const table = useTable({ defaultOrderBy: 'date' });

  const [filters, setFilters] = useState(defaultFilters);

  const tableData = settlements?.list || [];
  const summary = settlements?.summary || {};

  const summaryCards = useMemo(() => [
    { label: 'Total Settled (Today)', value: fIndianCurrency(summary.totalSettled), color: 'success' },
    { label: 'Total Deductions', value: fIndianCurrency(summary.deductions), color: 'error' },
    { label: 'Net Amount', value: fIndianCurrency(summary.netAmount), color: 'primary' },
    { label: 'Pending Settlements', value: fIndianCurrency(summary.pending), color: 'warning' },
  ], [summary]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

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

  const notFound = !dataFiltered.length;

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {summaryCards.map((card) => (
          <Grid item xs={12} md={3} key={card.label}>
            <SummaryCard 
                title={card.label} 
                data={[{ label: 'Current', value: card.value, color: card.color }]} 
            />
          </Grid>
        ))}
      </Grid>


      <Card>
        <SettlementTableToolbar
          filters={filters}
          onFilters={handleFilters}
          statusOptions={STATUS_OPTIONS}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 1200 }}>
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
                    <SettlementTableRow
                      key={row.id}
                      row={row}
                    />
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
    </Stack>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

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
        item.id.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        item.utr.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((item) => item.status === status);
  }

  return inputData;
}
