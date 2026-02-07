import isEqual from 'lodash/isEqual';
import { useState, useCallback } from 'react';
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
import { useGetAuditedFinancialsDetails } from 'src/api/companyKyc';

import GuarantorApprovalForm from '../guarantor-approvel-form';
import AuditedFinancialsGstr9Row from '../audited-financials-gstr9row';
import AuditedFinancialsGst3bRow from '../audited-financials-gst3b';


// ----------------------------------------------------------

const TABLE_HEAD = [
    { id: 'auditorName', label: 'Auditer Name' },
    { id: 'auditedType', label: 'Audited Type' },
    { id: 'status', label: 'Status' },
    { id: 'auditedType', label: 'ReportedAt' },
];

const defaultFilters = {
    name: '',
    status: 'all',
};

// ----------------------------------------------------------------------

export default function AuditedFinancialsGst3bListView({ companyProfile }) {
    const table = useTable();

    const settings = useSettingsContext();
    const router = useRouter();
    const confirm = useBoolean();

    const companyId = companyProfile?.data?.id


    const {auditedFinancials = []}= useGetAuditedFinancialsDetails(companyId);

   const financialsData  =  auditedFinancials?.gst3b  || []

    const [openDialog, setOpenDialog] = useState(false);
    const [selectedGuarantor, setSelectedGuarantor] = useState(null);

    const handleViewRow = (row) => {
        setSelectedGuarantor(row);
        setOpenDialog(true);
    };

    const handleEditRow = useCallback(
        (id) => {
            router.push(paths.dashboard.designation.edit(id));
        },
        [router]
    );

    const [filters, setFilters] = useState(defaultFilters);

    const dataFiltered = applyFilter({
        inputData: financialsData,
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



    const handleDeleteRow = useCallback(
        (id) => {
            table.onUpdatePageDeleteRow(dataInPage.length);
        },
        [dataInPage.length, table]
    );

    const handleDeleteRows = useCallback(() => {
        table.onUpdatePageDeleteRows({
            totalRows: financialsData.length,
            totalRowsInPage: dataInPage.length,
            totalRowsFiltered: dataFiltered.length,
        });
    }, [dataFiltered.length, dataInPage.length, financialsData.length, table]);



    return (
        <>
            <Container maxWidth={settings.themeStretch ? false : 'lg'}>
                <Card>
                    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
                        <TableSelectedAction
                            dense={table.dense}
                            numSelected={table.selected.length}
                            rowCount={financialsData.length}
                            onSelectAllRows={(checked) =>
                                table.onSelectAllRows(
                                    checked,
                                    financialsData.map((row) => row.id)
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
                                    rowCount={financialsData.length}
                                    numSelected={table.selected.length}
                                    onSort={table.onSort}
                                    onSelectAllRows={(checked) =>
                                        table.onSelectAllRows(
                                            checked,
                                            financialsData.map((row) => row.id)
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
                                            <AuditedFinancialsGst3bRow
                                                key={row.id}
                                                row={row}
                                                selected={table.selected.includes(row.id)}
                                                onSelectRow={() => table.onSelectRow(row.id)}
                                                onDeleteRow={() => handleDeleteRow(row.id)}
                                                onViewRow={() => handleViewRow(row)}
                                                onEditRow={() => handleEditRow(row.id)}
                                            />
                                        ))}


                                    <TableNoData notFound={notFound} />
                                </TableBody>
                            </Table>
                        </Scrollbar>
                    </TableContainer>

                    {/* <TablePaginationCustom
                        count={dataFiltered.length}
                        page={table.page}
                        rowsPerPage={table.rowsPerPage}
                        onPageChange={table.onChangePage}
                        onRowsPerPageChange={table.onChangeRowsPerPage}
                        dense={table.dense}
                        onChangeDense={table.onChangeDense}
                    /> */}
                </Card>
            </Container>

            <GuarantorApprovalForm
                open={openDialog}
                guarantor={selectedGuarantor}
                onClose={() => {
                    setOpenDialog(false);
                    setSelectedGuarantor(null);
                }}
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
    const { name, status } = filters;

    const stabilizedThis = inputData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
        inputData = inputData.filter((emails) =>
            Object.values(emails).some((value) =>
                String(value).toLowerCase().includes(name.toLowerCase())
            )
        );
    }

    if (status !== 'all') {
        inputData = inputData.filter((emails) =>
            status === 'active' ? !emails.isDeleted : emails.isDeleted
        );
    }

    return inputData;
}
