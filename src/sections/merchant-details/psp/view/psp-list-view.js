import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';

// routes
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
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { useSnackbar } from 'src/components/snackbar';
import PSPIntegrationForm from '../psp-edit-view';
import { useGetPspDetails } from 'src/api/merchant-kyc';
import PSPTableRow from '../psp-table-row';
import PSPTableToolbar from '../psp-table-toolbar';
import PSPTableFiltersResult from '../psp-table-filters-result';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'pspName', label: 'PSP Name' },
  { id: 'merchantId', label: 'Merchant ID' },
  { id: 'settlementAccount', label: 'Settlement Account' },
  { id: 'apiKey', label: 'Api Key' },
  { id: 'apiSecret', label: 'Api Secret' },
  { id: 'status', label: 'Status' },
  { id: '', label: 'Actions' },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function PSPListView({
  percent = () => {},
  merchantProfile,
}) {
  const table = useTable();

  const settings = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useBoolean();
  const [openAddPSP, setOpenAddPSP] = useState(false);
  const [selectedPSP, setSelectedPSP] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  const merchantId = merchantProfile?.data?.id;
  const { pspDetails = [], refreshPspDetails, loading } = useGetPspDetails(merchantId);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(pspDetails);
  }, [pspDetails]);

  useEffect(() => {
    if (!loading) {
      if (pspDetails.length >= 1) {
        percent(100);
      } else {
        percent(0);
      }
    }
  }, [pspDetails, loading, percent]);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const denseHeight = table.dense ? 52 : 72;
  const canReset = !isEqual(defaultFilters, filters);
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

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleCloseAddPSP = () => {
    setOpenAddPSP(false);
    setSelectedPSP(null);
    setEditMode(false);
    setViewMode(false);
  };

  const handleFormSubmit = useCallback(async () => {
    await refreshPspDetails();
  }, [refreshPspDetails]);

  const handleViewPSP = (row) => {
    setSelectedPSP(row);
    setViewMode(true);
    setOpenAddPSP(true);
    setEditMode(false);
  };

  const handleEditRow = useCallback((row) => {
    setSelectedPSP(row);
    setOpenAddPSP(true);
    setViewMode(false);
    setEditMode(true);
  }, []);

  const handleDeleteRow = useCallback(() => {
    enqueueSnackbar('Delete API not implemented yet', { variant: 'warning' });
  }, [enqueueSnackbar]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card>
          <PSPTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <PSPTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={dataFiltered.length}
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
                  showCheckbox={false}
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <PSPTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onViewRow={() => handleViewPSP(row)}
                        onEditRow={() => handleEditRow(row)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
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
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <PSPIntegrationForm
        open={openAddPSP}
        onClose={handleCloseAddPSP}
        currentPSP={selectedPSP}
        isEditMode={editMode}
        isViewMode={viewMode}
        approvalMode={viewMode}
        refreshPspDetails={refreshPspDetails}
        onSubmitSuccess={handleFormSubmit}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure want to delete ${table.selected.length} items?`}
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
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

PSPListView.propTypes = {
  percent: PropTypes.func,
  merchantProfile: PropTypes.object,
};

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
        item?.pspMaster?.name?.toLowerCase().includes(name.toLowerCase()) ||
        item?.merchantId?.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((emails) =>
      status === 'active' ? !emails.isDeleted : emails.isDeleted
    );
  }

  return inputData;
}
