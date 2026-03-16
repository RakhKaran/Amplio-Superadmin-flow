import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hook';
import { RouterLink } from 'src/routes/components';
// _mock
import { _userList, _roles, USER_STATUS_OPTIONS } from 'src/_mock';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
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
//
import PropTypes from 'prop-types';
import { Box, Stack, Typography } from '@mui/material';
import KYCAddUBOsForm from '../kyc-add-benificial-owner-form';
// import UboTableFiltersResult from '../ubo-table-filters-result';
import UboTableRow from '../ubo-table-row';
// import UboTableToolbar from '../ubo-table-toolbar';
import { useGetUboDetails } from 'src/api/merchant-kyc';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'fullName', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone Number' },
  { id: 'ownershipPercentage', label: 'Ownership %' },
  { id: 'designationValue', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: '', label: 'Action', width: 88 },
];
const defaultFilters = {
  name: '',
  role: [],
  status: 'all',
};

const handledUboAutoNavigationByMerchant = new Set();

const getMerchantStorageId = () =>
  sessionStorage.getItem('merchant_user_id') || sessionStorage.getItem('merchant_profile_id');

const getUboNextConfirmedKey = (merchantId) => `kyc_ubo_next_confirmed:${merchantId}`;

// ----------------------------------------------------------------------

export default function UbosListView({
  percent,
  setActiveStepId,
  setDataInitializedSteps,
  dataInitializedSteps,
  merchantProfile,
}) {
  const table = useTable();

  const settings = useSettingsContext();

  const router = useRouter();

  const confirm = useBoolean();
  const [open, setOpen] = useState(false);
  const [selectedUBO, setSelectedUBO] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const merchantId = merchantProfile?.data?.id;

  const { uboDetails = [], refreshUboDetails, loading } = useGetUboDetails(merchantId);

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    setTableData(uboDetails);
  }, [uboDetails]);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  useEffect(() => {
    if (loading) return;

    if (uboDetails.length >= 1) {
      percent?.(100);

      if (!dataInitializedSteps?.includes('kyc_ubo_details')) {
        setDataInitializedSteps?.();
      }
    } else {
      percent?.(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataInitializedSteps, loading, uboDetails]);

  useEffect(() => {
    if (loading) return;

    const merchantId = getMerchantStorageId();

    if (!merchantId || handledUboAutoNavigationByMerchant.has(merchantId)) return;

    handledUboAutoNavigationByMerchant.add(merchantId);

    if (
      uboDetails.length >= 1 &&
      sessionStorage.getItem(getUboNextConfirmedKey(merchantId)) === 'true'
    ) {
      setActiveStepId();
    }
  }, [loading, setActiveStepId, uboDetails]);

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

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleAdd = () => {
    setSelectedUBO(null);
    setViewMode(false);
    setEditMode(false);
    setOpen(true);
  };

  const handleView = (row) => {
    setSelectedUBO(row);
    setViewMode(true);
    setEditMode(false);
    setOpen(true);
  };

  const handleEdit = (row) => {
    setSelectedUBO(row);
    setEditMode(true);
    setViewMode(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUBO(null);
    setViewMode(false);
    setEditMode(false);
  };

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleNext = () => {
    const merchantId = getMerchantStorageId();

    if (merchantId) {
      sessionStorage.setItem(getUboNextConfirmedKey(merchantId), 'true');
    }

    percent?.(100);
    setActiveStepId();
  };

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="h3" color="primary" sx={{ fontWeight: 700 }}>
            Ultimate Beneficial Owners
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Add all UBO details for merchant KYC verification.
          </Typography>
        </Stack> */}
        {/* <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h4" color="primary">
            Add UBO
          </Typography>

          <Button
            onClick={handleAdd}
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Ubo
          </Button>
        </Stack> */}

        <Card>
          {/* <UboTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={_roles}
          /> */}

          {/* {canReset && (
            <UboTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )} */}

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
                      <UboTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                        onEditRow={() => handleEdit(row)}
                        handleView={handleView}
                      />
                    ))}

                  {/* <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  /> */}

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

      <KYCAddUBOsForm
        open={open}
        currentUser={selectedUBO}
        isViewMode={viewMode}
        isEditMode={editMode}
        approvalMode={viewMode}
        refreshUboDetails={refreshUboDetails}
        onClose={handleClose}
      />

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

UbosListView.propTypes = {
  percent: PropTypes.func.isRequired,
  setActiveStepId: PropTypes.func.isRequired,
  dataInitializedSteps: PropTypes.array,
  setDataInitializedSteps: PropTypes.func,
  merchantProfile: PropTypes.object,
};

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter((user) =>
      user.fullName?.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.designationValue));
  }

  return inputData;
}
