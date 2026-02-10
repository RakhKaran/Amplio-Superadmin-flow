import { Button, Divider, Grid, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import FormProvider, {
    RHFCustomFileUploadBox,
    RHFTextField,
} from "src/components/hook-form";
import Label from "src/components/label";

const STATUS_DISPLAY = {
    0: { label: 'Under Review', color: 'info' },
    1: { label: 'Approved', color: 'success' },
    2: { label: 'Rejected', color: 'error' },
};

export function CollateralAssetForm({ asset, index, onApprove, onReject }) {
    const methods = useForm({
        defaultValues: {
            collateralType: asset.collateralTypes?.label ?? '',
            chargeType: asset.chargeTypes?.label ?? '',
            ownershipType: asset.ownershipTypes?.label ?? '',
            description: asset.description ?? '',
            estimatedValue: asset.estimatedValue ?? '',
            valuationDate: asset.valuationDate
                ? format(new Date(asset?.valuationDate), 'dd/MM/yyyy') 
                : '',


            trustName: asset.trustName ?? '',
            securityDocRef: asset.securityDocumentRef ?? '',
            securityDocument: asset.securityDocument
                ? {
                    id: asset.securityDocument.id,
                    fileOriginalName: asset.securityDocument.fileOriginalName,
                    fileUrl: asset.securityDocument.fileUrl,
                }
                : null,
            remark: asset.remark ?? '',
        },
    });

    const isFinalStatus = asset.status === 1 || asset.status === 2;

    return (
        <FormProvider methods={methods}>


            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2, mt: index ? 4 : 0 }}
                >
                    Collateral Asset {index + 1}
                </Typography>

                {/* Status */}
                <Label
                    color={STATUS_DISPLAY[asset?.status]?.color || 'default'}
                    sx={{ px: 2, py: 1, borderRadius: 1 }}
                >
                    {STATUS_DISPLAY[asset?.status]?.label || 'Unknown'}
                </Label>
            </Stack>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <RHFTextField name="collateralType" label="Collateral Type" disabled />
                </Grid>

                <Grid item xs={12} md={6}>
                    <RHFTextField name="chargeType" label="Charge Type" disabled />
                </Grid>

                <Grid item xs={12} md={6}>
                    <RHFTextField
                        name="estimatedValue"
                        label="Estimated Value"
                        disabled
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <RHFTextField name="trustName" label="Trust Name" disabled />
                </Grid>

                <Grid item xs={12} md={6}>
                    <RHFTextField
                        name="valuationDate"
                        label="Valuation Date"
                        disabled
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <RHFTextField
                        name="ownershipType"
                        label="Ownership Type"
                        disabled
                    />
                </Grid>

                <Grid item xs={12}>
                    <RHFTextField
                        name="securityDocRef"
                        label="Security Document Ref"
                        disabled
                    />
                </Grid>

                <Grid item xs={12}>
                    <RHFTextField
                        name="description"
                        label="Asset Description"
                        multiline
                        rows={3}
                        disabled
                    />
                </Grid>

                <Grid item xs={12}>
                    <RHFCustomFileUploadBox
                        name="securityDocument"
                        label="Security Document"
                        disabled
                    />
                </Grid>
            </Grid>



            <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                    variant="soft"
                    color="error"
                    disabled={isFinalStatus}
                    onClick={() => onReject(asset.id)}
                >
                    Decline
                </Button>

                <Button
                    variant="soft"
                    color="success"
                    disabled={isFinalStatus}
                    onClick={() => onApprove(asset.id)}
                >
                    Approve
                </Button>
            </Stack>
            <Divider sx={{ my: 3 }} />
        </FormProvider>
    );
}
