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
import { useFilterMerchantProfiles } from 'src/api/merchant-profiles';
import { buildFilter } from 'src/utils/filters';
import MerchantDetailsTableRow from '../merchant-details-table-row';
import MerchantDetailsTableToolbar from '../merchant-details-table-toolbar';
import MerchantDetailsTableFiltersResult from '../merchant-details-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All', color: 'default' },
  { value: 0, label: 'Pending', color: 'warning' },
  { value: 1, label: 'Under Review', color: 'info' },
  { value: 2, label: 'Approved', color: 'success' },
  { value: 3, label: 'Rejected', color: 'error' },
];

const TABLE_HEAD = [
  { id: 'merchantName', label: 'Merchant Name' },
  { id: 'CIN', label: 'CIN' },
  { id: 'GSTIN', label: 'GSTIN' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Created At' },
  { id: '', label: 'Actions' },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

// ----------------------------------------------------------------------

export default function MerchantDetailsListView() {
  const table = useTable();

  const settings = useSettingsContext();
  const router = useRouter();

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const confirm = useBoolean();

  const filter = buildFilter({
    page: table.page,
    rowsPerPage: table.rowsPerPage,
    order: table.order,
    orderBy: table.orderBy,
    validSortFields: ['merchantName', 'CIN', 'GSTIN'],
    searchTextValue: filters.name,
  });

  const filterJson = encodeURIComponent(JSON.stringify(filter));

  const params = {
    filter: filterJson,
    status: filters.status === 'all' ? undefined : Number(filters.status),
  };

  const { filteredMerchantProfiles, totalCount, filterLoading } = useFilterMerchantProfiles(params);

  useEffect(() => {
    if (filteredMerchantProfiles) {
      setTableData(filteredMerchantProfiles);
    }
  }, [filteredMerchantProfiles]);

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!tableData.length && canReset) || !tableData.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prev) => ({ ...prev, [name]: value }));
    },
    [table]
  );

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(tableData.length);
    },
    [table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: tableData.length,
      totalRowsFiltered: tableData.length,
    });
  }, [table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.merchantDetails.details(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Merchant Details List"
          links={[
            { name: 'Dashboard', href: paths.dashboard.root },
            { name: 'Merchant Details', href: paths.dashboard.merchantDetails.root },
            { name: 'List' },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />

        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'}
                    color={tab.color}
                  >
                    {tab.value === 'all' ? totalCount.totalCount : totalCount[tab.value]}
                    {tab.value === 0 && totalCount.totalPending}
                    {tab.value === 1 && totalCount.totalUnderReview}
                    {tab.value === 2 && totalCount.totalVerified}
                    {tab.value === 3 && totalCount.totalRejected}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <MerchantDetailsTableToolbar filters={filters} onFilters={handleFilters} />

          {canReset && (
            <MerchantDetailsTableFiltersResult
              filters={filters}
              onFilters={handleFilters}
              onResetFilters={handleResetFilters}
              results={tableData.length}
              statusOptions={STATUS_OPTIONS}
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
                  {tableData.map((row) => (
                    <MerchantDetailsTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={totalCount.totalCount}
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
