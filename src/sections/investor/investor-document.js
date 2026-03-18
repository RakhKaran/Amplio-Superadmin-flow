import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Card,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import { enqueueSnackbar } from 'notistack';
import axiosInstance from 'src/utils/axios';



import Label from 'src/components/label';
import { TableNoData } from 'src/components/table';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';
import { useGetDocuments } from 'src/api/investorKyc';
import DocumentPreviewButton from 'src/components/custom-preview-button/preview-button';

export default function InvestorDocumentDetails({ investorProfile }) {
    const investorId = investorProfile?.data?.id;

    const { documents: apiDocuments = [], refreshDocuments } = useGetDocuments(investorId);

    const documents = investorProfile?.data?.documents || apiDocuments;

    console.log(documents)


    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);

    // APPROVE DOCUMENT
    const handleApprove = async (documentId) => {
        try {
            await axiosInstance.patch('/investor-profiles/document-verification', {
                status: 1,
                documentId,
                reason: '',
            });

            enqueueSnackbar('Document Approved', { variant: 'success' });
            refreshDocuments(); // Refresh instantly
        } catch (err) {
            enqueueSnackbar('Approval failed', { variant: 'error' });
        }
    };

    // OPEN REJECT POPUP
    const handleRejectClick = (documentId) => {
        setSelectedDocumentId(documentId);
        setRejectOpen(true);
    };

    // SUBMIT REJECTION
    const handleRejectSubmit = async () => {
        if (!rejectReason) {
            enqueueSnackbar('Please enter a reason', { variant: 'warning' });
            return;
        }

        try {
            await axiosInstance.patch('/investor-profiles/document-verification', {
                status: 2,
                documentId: selectedDocumentId,
                reason: rejectReason,
            });

            enqueueSnackbar('Document Rejected', { variant: 'success' });

            setRejectOpen(false);
            setRejectReason('');
            refreshDocuments(); // Refresh instantly
        } catch (err) {
            enqueueSnackbar('Rejection failed', { variant: 'error' });
        }
    };

    return (
        <>
            <Card sx={{ p: 3 }}>

                <Typography variant="h5" color='primary' sx={{ mb: 2 }}>
                    KYB Document
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <b>Document Name</b>
                                </TableCell>
                                <TableCell>
                                    <b>Preview Document</b>
                                </TableCell>
                                <TableCell>
                                    <b>Status</b>
                                </TableCell>
                                <TableCell align="right">
                                    <b>Actions</b>
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {documents.length === 0 ? (
                                <TableNoData notFound />
                            ) : (
                                documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell>{doc.documents?.name || 'NA'}</TableCell>
                                        <TableCell>
                                            <DocumentPreviewButton
                                                fileName={doc.documentsFile?.fileName}
                                                fileUrl={doc.documentsFile?.fileUrl}
                                                errorMessage='File not found'
                                                buttonText='Preview Document'
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Label
                                                variant="soft"
                                                color={
                                                    (doc.status === 1 && 'success') ||
                                                    (doc.status === 0 && 'warning') ||
                                                    (doc.status === 2 && 'error') ||
                                                    'default'
                                                }
                                            >
                                                {doc.status === 1 ? 'Approved' : doc.status === 0 ? 'Pending' : 'Rejected'}
                                            </Label>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => {
                                                        const url = doc.documentsFile?.fileUrl;
                                                        if (url) {
                                                            const link = document.createElement('a');
                                                            link.href = url;
                                                            link.setAttribute('download', doc.documentsFile?.fileName || 'document');
                                                            link.target = '_blank';
                                                            document.body.appendChild(link);
                                                            link.click();
                                                            document.body.removeChild(link);
                                                        } else {
                                                            enqueueSnackbar('File URL not found!', { variant: 'error' });
                                                        }
                                                    }}
                                                >
                                                    <Iconify icon="eva:cloud-download-fill" width={26} />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Card>

            {/* REJECT DIALOG */}
            <RejectReasonDialog
                open={rejectOpen}
                onClose={() => setRejectOpen(false)}
                reason={rejectReason}
                setReason={setRejectReason}
                onSubmit={handleRejectSubmit}
            />
        </>
    );
}
