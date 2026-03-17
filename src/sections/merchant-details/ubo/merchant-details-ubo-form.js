import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { format } from 'date-fns';
// @mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { DatePicker } from '@mui/x-date-pickers';
import { Stack, Typography } from '@mui/material';
// components
import FormProvider, {
  RHFCustomFileUploadBox,
  RHFSelect,
  RHFTextField,
} from 'src/components/hook-form';

// ----------------------------------------------------------------------

const UBO_ROLES = [
  { value: 'proprietor', label: 'Proprietor (Sole Owner)' },
  { value: 'partner', label: 'Partner' },
  { value: 'designated_partner', label: 'Designated Partner (LLP)' },
  { value: 'director', label: 'Director' },
  { value: 'shareholder', label: 'Shareholder' },
  { value: 'authorized_signatory', label: 'Authorized Signatory' },
  { value: 'trustee', label: 'Trustee' },
  { value: 'beneficiary', label: 'Beneficiary Owner' },
  { value: 'other', label: 'Other' },
];

export default function MerchantDetailsUboForm({ open, onClose, currentUser }) {
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Invalid email'),
    phoneNumber: Yup.string().required('Phone number is required'),
    role: Yup.string().required('Role is required'),
    ownershipPercentage: Yup.number().required('Ownership percentage is required'),
    submittedPanFullName: Yup.string().required('PAN Holder Name is required'),
    submittedPanNumber: Yup.string().required('PAN Number is required'),
    submittedDateOfBirth: Yup.string().required('DOB is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.fullName || '',
      email: currentUser?.email || '',
      phoneNumber: currentUser?.phone || '',
      role: currentUser?.designationValue || '',
      ownershipPercentage: currentUser?.ownershipPercentage || '',
      panCard: currentUser?.panCard || null,
      submittedPanFullName: currentUser?.submittedPanFullName || '',
      submittedPanNumber: currentUser?.submittedPanNumber || '',
      submittedDateOfBirth: currentUser?.submittedDateOfBirth || '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { reset, control } = methods;

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, currentUser, reset, defaultValues]);

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods}>
        <DialogTitle color="primary">View UBO Details</DialogTitle>

        <DialogContent sx={{ pr: 2 }}>
          <Box rowGap={3} display="grid" mt={2}>
            <RHFTextField name="name" label="Name" disabled />

            <RHFTextField name="email" label="Email" disabled />

            <RHFTextField name="phoneNumber" label="Phone Number" disabled />
            
            <RHFTextField name="ownershipPercentage" label="Ownership Percentage" disabled />
            
            <RHFSelect name="role" label="Designation" disabled>
              <MenuItem value="" disabled>Select Designation</MenuItem>
              {UBO_ROLES.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </RHFSelect>

            <Typography variant="subtitle2" color="primary">
              PAN Section
            </Typography>

            <RHFCustomFileUploadBox
              name="panCard"
              label="PAN Card"
              disabled
            />

            <RHFTextField name="submittedPanFullName" label="PAN Holder Full Name" disabled />

            <RHFTextField name="submittedPanNumber" label="PAN Number" disabled />

            <Controller
              name="submittedDateOfBirth"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="PAN Date of Birth"
                  disabled
                  value={field.value ? new Date(field.value) : null}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: { fullWidth: true },
                  }}
                />
              )}
            />
          </Box>
          <Box sx={{ my: 3 }}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button variant="outlined" onClick={onClose}>
                Close
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
}

MerchantDetailsUboForm.propTypes = {
  currentUser: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
