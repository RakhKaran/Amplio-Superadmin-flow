import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Button,
    Stack,
    Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';

import FormProvider, { RHFCustomFileUploadBox, RHFTextField } from 'src/components/hook-form';
import RejectReasonDialog from 'src/components/reject dialog box/reject-dialog-box';
import axiosInstance from 'src/utils/axios';

export default function GuarantorApprovalForm({ open, guarantor, onClose }) {
    const { enqueueSnackbar } = useSnackbar();

    const methods = useForm({
        defaultValues: {
            guarantorType: '',
            CIN: '',
            guarantorName: '',
            phoneNumber: '',
            email: '',
            guaranteedAmountLimit: '',
            estimatedNetWorth: '',
        },
    });

    const { reset } = methods;

    useEffect(() => {
        if (!guarantor) return;

        reset({
            guarantorType: guarantor.guarantorType ?? '',
            CIN: guarantor.CIN ?? '',
            guarantorName: guarantor.guarantorCompanyName ?? '',
            phoneNumber: guarantor.phoneNumber ?? '',
            email: guarantor.email ?? '',
            guaranteedAmountLimit: guarantor.guaranteedAmountLimit ?? '',
            estimatedNetWorth: guarantor.estimatedNetWorth ?? '',
            companyAadhar: guarantor.companyAadhar
                ? {
                    id: guarantor.companyAadhar.id,
                    fileOriginalName: guarantor.companyAadhar.fileOriginalName,
                    fileUrl: guarantor.companyAadhar.fileUrl,
                }
                : null,
            companyPan: guarantor.companyPan
                ? {
                    id: guarantor.companyPan.id,
                    fileOriginalName: guarantor.companyPan.fileOriginalName,
                    fileUrl: guarantor.companyPan.fileUrl,
                }
                : null,
        });
    }, [guarantor, reset]);

    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    if (!guarantor) return null;

    const isFinalStatus = guarantor.status === 1;

    /* ---------------- APPROVE ---------------- */
    const handleApprove = async () => {
        await axiosInstance.patch('/company-profiles/guarantor-profile-verification', {
            id: guarantor.id,
            status: 1,
            reason: '',
        });

        enqueueSnackbar('Guarantor approved', { variant: 'success' });
        onClose();
    };

    /* ---------------- REJECT ---------------- */
    const handleRejectSubmit = async () => {
        await axiosInstance.patch('/company-profiles/guarantor-profile-verification', {
            id: guarantor.id,
            status: 2,
            reason: rejectReason,
        });

        enqueueSnackbar('Guarantor rejected', { variant: 'error' });
        setRejectOpen(false);
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Guarantor Verification</DialogTitle>

                <DialogContent dividers >
                    <FormProvider methods={methods}>
                        <Grid container spacing={3} sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <RHFTextField name="guarantorType" label="Guarantor Type" disabled />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <RHFTextField name="CIN" label="CIN" disabled />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <RHFTextField name="guarantorName" label="Guarantor Name" disabled />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <RHFTextField
                                    name="guaranteedAmountLimit"
                                    label="Guaranteed Amount Limit"
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <RHFTextField name="phoneNumber" label="Phone Number" disabled />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <RHFTextField name="email" label="Email" disabled />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <RHFTextField
                                    name="estimatedNetWorth"
                                    label="Estimated Net Worth (INR)"
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <RHFCustomFileUploadBox
                                    name="companyAadhar"
                                    label="Addhar Card"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <RHFCustomFileUploadBox
                                    name="companyPan"
                                    label="Pan Card"
                                    disabled
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 3 }} />

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="soft"
                                color="error"
                                disabled={isFinalStatus}
                                onClick={() => setRejectOpen(true)}
                            >
                                Decline
                            </Button>

                            <Button
                                variant="soft"
                                color="success"
                                disabled={isFinalStatus}
                                onClick={handleApprove}
                            >
                                Approve
                            </Button>
                        </Stack>
                    </FormProvider>
                </DialogContent>
            </Dialog>

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
