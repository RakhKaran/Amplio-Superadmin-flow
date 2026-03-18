import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';

// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//

import PTCTableFiltersResult from '../transaction-table-filters-result';
import PTCTableRow from '../transaction-table-row';
import PTCTableToolbar from '../transaction-table-toolbar';
import TransactionDetailsCards from '../transaction-details-card';


// ----------------------------------------------------------------------
const FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Bank to Escrow', value: 'bankToEscrow' },
  { label: 'Escrow to Bank', value: 'escrowToBank' },
  { label: 'PTC Purchases', value: 'ptc' },
];

const TABLE_HEAD = [
  { id: 'tType', label: 'Name' },
  { id: 'amount', label: 'Amount' },
  { id: 'from', label: 'From' },
  { id: 'to', label: 'To' },
  { id: 'reference', label: 'Reference' },
  { id: 'date', label: 'Date' },
];

const defaultFilters = {
  name: '',
  type: [],
};

// ----------------------------------------------------------------------

export default function TransactionListView({ transactionsData }) {
  const table = useTable({ defaultOrderBy: 'date' });

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();

  const [tableData, setTableData] = useState(normalizeTransactions(transactionsData || []));

  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    setTableData(normalizeTransactions(transactionsData || []));
  }, [transactionsData]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const canReset = !!filters.name || !!filters.type.length;

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // const handleViewRow = useCallback(
  //   (id) => {
  //     router.push(paths.dashboard.order.details(id));
  //   },
  //   [router]
  // );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.investor.details(id));
    },
    [router]
  );

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <TransactionDetailsCards transactions={transactionsData} />
        <Typography variant="h5" color="primary" sx={{mt:{ xs: 2, md: 3 }, mb: { xs: 1, md: 1} }}>
          All Transactions - Audit Trail
        </Typography>

        <Card>
          <PTCTableToolbar
            filters={filters}
            onFilters={handleFilters}
            typeOptions={FILTER_OPTIONS.filter((option) => option.value !== 'all')}
          />

          {canReset && (
            <PTCTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
              typeOptions={FILTER_OPTIONS}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <PTCTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
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
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, type } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (transaction) =>
        transaction.tType?.toLowerCase().includes(name.toLowerCase()) ||
        transaction.from?.toLowerCase().includes(name.toLowerCase()) ||
        transaction.to?.toLowerCase().includes(name.toLowerCase()) ||
        transaction.reference?.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (type.length) {
    inputData = inputData.filter((transaction) => type.includes(getTransactionCategory(transaction)));
  }

  return inputData;
}

function getTransactionCategory(transaction) {
  if (transaction.to === 'Escrow Account') {
    return 'bankToEscrow';
  }

  if (transaction.from === 'Escrow Account' && transaction.to?.includes('Bank')) {
    return 'escrowToBank';
  }

  if (transaction.to === 'Smile Wave SPV') {
    return 'ptc';
  }

  return 'all';
}

function normalizeTransactions(transactions) {
  return transactions.map((transaction, index) => ({
    ...transaction,
    id: transaction.id || transaction.transactionId || `${transaction.reference || 'transaction'}-${index}`,
  }));
}
