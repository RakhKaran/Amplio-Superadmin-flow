import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { TableNoData } from 'src/components/table';
import { Card, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import { useGetSignatories } from 'src/api/companyKyc';
import CompanySignatoriesDetails from './company-signatory-details';

// ----------------------------------------------------------------------

const StyledSearch = styled(TextField)(({ theme }) => ({
  width: 300,
  '& .MuiOutlinedInput-root': {
    height: 40,
    '& fieldset': {
      borderColor: theme.palette.grey[500],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

// ----------------------------------------------------------------------

export default function CompanySignatories({ companyProfile }) {
   const userId = companyProfile?.data?.id;
  const stepperId = companyProfile?.kycApplications?.currentProgress?.[3];

  function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
  }

  const [searchTerm, setSearchTerm] = useState('');
  // const { signatories, refreshSignatories } = useGetSignatories(userId, stepperId);

  const debouncedSearch = useDebounce(searchTerm, 500);

 
  const filter = {
    where: {
      or: [
        { fullName: { like: `%${debouncedSearch}%`, options: 'i' } },
        { phone: { like: `%${debouncedSearch}%`, options: 'i' } },
        { email: { like: `%${debouncedSearch}%`, options: 'i' } },
      ],
    },
  };



  const { signatories, refreshSignatories } = useGetSignatories(
    userId,
    encodeURIComponent(JSON.stringify(filter))
  );

  console.log("📌 Fetched Signatories:", signatories);
  const [selectedSignatory, setSelectedSignatory] = useState(null);


  // FILTER TABLE
  const filteredRows = signatories.filter((row) =>
    Object.values(row).some(
      (value) => value && value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    )
  );

  return (
    <>
      <Card
        sx={{
          p: 4,
        }}
      >
        {/* TOP BAR */}
        <Box
          sx={{
            mb: 5,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 2, sm: 0 },
          }}
        >
          <Typography variant="h4">Signatories</Typography>

          <StyledSearch
            placeholder="Search signatories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', sm: 300 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* TABLE */}
        <TableContainer component={Paper} sx={{ mb: 5 }}>
          <Table sx={{ minWidth: 650 }} aria-label="signatories table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {signatories.length === 0 ? (
                <TableNoData notFound />

              ) : (
                filteredRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.fullName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{row.phone}</TableCell>

                    <TableCell>
                      <Label
                        variant="soft"
                        color={
                          (row.status === 1 && 'success') ||
                          (row.status === 0 && 'warning') ||
                          (row.status === 2 && 'error') ||
                          'default'
                        }
                      >
                        {row.status === 1
                          ? 'Approved'
                          : row.status === 2
                            ? 'Rejected'
                            : 'Under Review'}
                      </Label>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          alignItems: 'center',
                          gap: 1.5, // Proper spacing
                        }}
                      >
                        <Tooltip title="View" placement="top" arrow>
                          <IconButton onClick={() => setSelectedSignatory(row)}>
                            <Iconify icon="mdi:eye" width={20} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                )))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog
        open={!!selectedSignatory}
        onClose={() => setSelectedSignatory(null)}
        fullWidth
        maxWidth={false}
        PaperProps={{ sx: { maxWidth: 960 } }}
      >
        <DialogTitle color="primary">Signatory Details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedSignatory && (
            <CompanySignatoriesDetails
              currentUser={selectedSignatory}
              isViewMode
              isEditMode={false}
              disableCardWrapper
              onStatusChange={() => {
                refreshSignatories();
                setSelectedSignatory(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

CompanySignatories.propTypes = {
  companyProfile: PropTypes.object,
};
