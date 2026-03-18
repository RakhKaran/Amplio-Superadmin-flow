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

export default function GuarantorApprovalForm({ open, guarantor, onClose, refreshGuarantorDetails }) {
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
            boardResoluton: guarantor.boardResoluton
                ? {
                    id: guarantor.boardResoluton.id,
                    fileOriginalName: guarantor.boardResoluton.fileOriginalName,
                    fileUrl: guarantor.boardResoluton.fileUrl,
                }
                : null,
            gstCertificate: guarantor.gstCertificate
                ? {
                    id: guarantor.gstCertificate.id,
                    fileOriginalName: guarantor.gstCertificate.fileOriginalName,
                    fileUrl: guarantor.gstCertificate.fileUrl,
                }
                : null,
            financialStatement: guarantor.financialStatement
                ? {
                    id: guarantor.financialStatement.id,
                    fileOriginalName: guarantor.financialStatement.fileOriginalName,
                    fileUrl: guarantor.financialStatement.fileUrl,
                }
                : null,
            companyPan: guarantor.companyPan
                ? {
                    id: guarantor.companyPan.id,
                    fileOriginalName: guarantor.companyPan.fileOriginalName,
                    fileUrl: guarantor.companyPan.fileUrl,
                }
                : null,
            addressProof: guarantor.addressProof
                ? {
                    id: guarantor.addressProof.id,
                    fileOriginalName: guarantor.addressProof.fileOriginalName,
                    fileUrl: guarantor.addressProof.fileUrl,
                }
                : null,

            itr: guarantor.itr
                ? {
                    id: guarantor.itr.id,
                    fileOriginalName: guarantor.itr.fileOriginalName,
                    fileUrl: guarantor.itr.fileUrl,
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
  try {
    await axiosInstance.patch('/company-profiles/guarantor-profile-verification', {
      id: guarantor.id,
      status: 1,
      reason: '',
    });

    enqueueSnackbar('Guarantor approved', { variant: 'success' });
    refreshGuarantorDetails();
    onClose();
  } catch (error) {
    console.error(error);
    enqueueSnackbar(
      error?.error?.message || 'Something went wrong',
      { variant: 'error' }
    );
  }
};

    /* ---------------- REJECT ---------------- */
   const handleRejectSubmit = async () => {
  try {
    await axiosInstance.patch('/company-profiles/guarantor-profile-verification', {
      id: guarantor.id,
      status: 2,
      reason: rejectReason,
    });

    enqueueSnackbar('Guarantor rejected', { variant: 'error' });
    setRejectOpen(false);
    onClose();
  } catch (error) {
    console.error(error);
    enqueueSnackbar(
      error?.error?.message || 'Something went wrong',
      { variant: 'error' }
    );
  }
};

    const isCorporate = guarantor?.guarantorType === 'Corporate';
    const isIndividual = guarantor?.guarantorType === 'Individual';

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        height: '90vh',          
                        maxHeight: '90vh',
                        overflow: 'hidden',      
                        display: 'flex',
                        flexDirection: 'column',
                    },
                }}
            >
                <DialogTitle>Guarantor Verification</DialogTitle>

                <DialogContent
                    dividers
                    sx={{
                        flex: 1,
                        overflowY: 'auto',   // ✅ only this scrolls
                    }}
                >
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

                            {isCorporate && (
                                <>
                                    <Grid item xs={12} md={6}>
                                        <RHFTextField name="CIN" label="CIN" disabled />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <RHFTextField name="guarantorName" label="Company Name" disabled />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <RHFCustomFileUploadBox
                                            name="companyPan"
                                            label="Company PAN"
                                            disabled
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <RHFCustomFileUploadBox
                                            name="gstCertificate"
                                            label="GST Certificate (optional)"
                                            disabled
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <RHFCustomFileUploadBox
                                            name="boardResoluton"
                                            label="Board Resolution"
                                            disabled
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <RHFCustomFileUploadBox
                                            name="financialStatement"
                                            label="Financial Statement (optional)"
                                            disabled
                                        />
                                    </Grid>
                                </>
                            )}

                            {isIndividual && (
                                <>
                                    <Grid item xs={12} md={6}>
                                        <RHFTextField name="fullName" label="Full Name" disabled />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <RHFTextField name="panNumber" label="PAN Number" disabled />
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <RHFTextField name="adharNumber" label="Aadhar Number" disabled />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <RHFCustomFileUploadBox
                                            name="companyPan"
                                            label="PAN Card"
                                            disabled
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <RHFCustomFileUploadBox
                                            name="companyAadhar"
                                            label="Aadhar Card"
                                            disabled
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <RHFCustomFileUploadBox
                                            name="addressProof"
                                            label="Address Proof (optional)"
                                            disabled
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <RHFCustomFileUploadBox
                                            name="itr"
                                            label="ITR Document (optional)"
                                            disabled
                                        />
                                    </Grid>
                                </>
                            )}

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
