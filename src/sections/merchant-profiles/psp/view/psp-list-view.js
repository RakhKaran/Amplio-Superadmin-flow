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

// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// api
import { RouterLink } from 'src/routes/components';

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

import { Box, Typography } from '@mui/material';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/named
// import { useGetPSPs } from 'src/api/merchantKyc';
import axiosInstance from 'src/utils/axios';
import PSPTableRow from '../psp-table-row';
import PSPIntegrationForm from '../psp-edit-view';
import { useGetPspDetails } from 'src/api/merchant-kyc';

// ----------------------------------------------------------------------
const DUMMY_PSPS = [
  {
    id: '1',
    psp: 'razorpay',
    merchantId: 'rzp_live_8FJ3kL9dE2',
    settlementAccount: 'XXXX1234',
    apiKey: 'rzp_test_key_123456',
    apiSecret: 'rzp_secret_abcdef',
  },
  {
    id: '2',
    psp: 'cashfree',
    merchantId: 'cf_live_92kslK2',
    settlementAccount: 'XXXX5678',
    apiKey: 'cf_api_key_987654',
    apiSecret: 'cf_secret_123abc',
  },
  {
    id: '3',
    psp: 'stripe',
    merchantId: 'stripe_merchant_44X',
    settlementAccount: 'XXXX9876',
    apiKey: 'stripe_api_key_456789',
    apiSecret: 'stripe_secret_xyz',
  },
  {
    id: '4',
    psp: 'payu',
    merchantId: 'payu_live_7721',
    settlementAccount: 'XXXX4321',
    apiKey: 'payu_api_key_654321',
    apiSecret: 'payu_secret_789xyz',
  },
];
const STATUS_OPTIONS = [{ value: 'all', label: 'All' }];

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
  setActiveStepId,
  saveStepData,
  percent = () => {},
  merchantProfile,
}) {
  const table = useTable();

  const settings = useSettingsContext();
  const router = useRouter();
  const confirm = useBoolean();
  const [openAddPSP, setOpenAddPSP] = useState(false);
  const [selectedPSP, setSelectedPSP] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);

  // const { psps = [], refreshPsps, loading } = useGetPSPs();
  const merchantId = merchantProfile?.data?.id;
  const { pspDetails = [], refreshPspDetails, loading } = useGetPspDetails(merchantId);

  useEffect(() => {
    if (!loading) {
      if (pspDetails.length >= 1) {
        percent(100);
      } else {
        percent(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pspDetails, loading]);

  const tableData = pspDetails;
  // console.log('psp tableData',tableData);
  // const [tableData, setTableData] = useState(DUMMY_PSPS);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const refreshPSPs = () => {
  //   setTableData([...DUMMY_PSPS]);
  // };
  // const tableData = psps;

  const handleOpenAddPSP = () => {
    setSelectedPSP(null);
    setOpenAddPSP(true);
    setEditMode(false);
  };

  const handleCloseAddPSP = () => {
    setOpenAddPSP(false);
    setSelectedPSP(null);
    setEditMode(false);
  };

  const handleFormSubmit = useCallback(async () => {
    await refreshPspDetails();
  }, [refreshPspDetails]);
  // const handleFormSubmit = useCallback((newPSP) => {
  //   const newItem = {
  //     id: Date.now().toString(),
  //     pspName: newPSP.psp,
  //     pspType: 'Payment Gateway',
  //     merchantId: newPSP.merchantId,
  //     settlementAccount: newPSP.settlementAccount,
  //     apiKey: newPSP.apiKey,
  //     apiSecret: newPSP.apiSecret,
  //     GaurantorAmountLimit: '₹5,00,000',
  //     estimatedNetWorth: '₹10,00,000',
  //     status: 'pending',
  //   };

  //   setTableData((prev) => [...prev, newItem]);

  //   handleCloseAddPSP();
  // }, []);

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

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.tableData.details(id));
    },
    [router]
  );

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
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(() => {
    enqueueSnackbar('Delete API not implemented yet', { variant: 'warning' });
  }, []);

  // Update percent when psps are added
  useEffect(() => {
    if (tableData && tableData.length >= 1) {
      percent(100);
    } else {
      percent(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        {/* <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h4" color="primary">
            PSP List
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleOpenAddPSP}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.main',
                boxShadow: 'none',
              },
            }}
          >
            Add PSP
          </Button>
        </Box> */}

        <Card>
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
                    emptyRows={emptyRows(table.page, table.rowsPerPage)}
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
  setActiveStepId: PropTypes.func,
  saveStepData: PropTypes.func,
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
        item?.pspName?.toLowerCase().includes(name.toLowerCase()) ||
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
