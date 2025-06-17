// frontend/src/components/DataView.jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button, CircularProgress, Alert, Box, Typography, Paper,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Link, AlertTitle, Stack
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AssessmentIcon from '@mui/icons-material/Assessment';

function DataView() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headers, setHeaders] = useState([]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/transactions');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data);
      if (data && data.length > 0) {
        setHeaders(Object.keys(data[0]));
      } else {
        setHeaders([]);
      }
    } catch (e) {
      setError(e.message);
      console.error("Failed to fetch transactions:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}><CircularProgress size={60} /></Box>;
  }

  if (error) {
    return (
      <Paper component={Box} p={3} elevation={3} sx={{ textAlign: 'center', mt: {xs:2, sm:4}, mx: 'auto', maxWidth: 600 }}>
        <Alert severity="error" icon={<InfoOutlinedIcon sx={{ fontSize: 30 }}/>} sx={{ justifyContent: 'center', py: 2, mb:2, flexDirection: 'column', alignItems: 'center', gap:1 }}>
            <AlertTitle sx={{fontWeight: 'bold'}}>Error Loading Transactions</AlertTitle>
            {error}
        </Alert>
        <Stack direction="row" spacing={2} justifyContent="center">
            <Button component={RouterLink} to="/" variant="outlined" startIcon={<UploadFileIcon />}>Upload New File</Button>
            <Button onClick={fetchTransactions} variant="outlined">Try Again</Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: {xs:1, sm:2}, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: {xs:2, sm:3}, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" component="h1" sx={{fontWeight: 'medium'}}>
          Transaction Data
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" component={RouterLink} to="/" startIcon={<UploadFileIcon />}>
            Upload New
          </Button>
          <Button variant="contained" component={RouterLink} to="/dashboard" startIcon={<AssessmentIcon />}>
            View Dashboard
          </Button>
        </Stack>
      </Box>
      {transactions.length === 0 ? (
        <Paper component={Box} p={{xs:2, sm:4}} elevation={1} sx={{ textAlign: 'center', mt: 4, mx: 'auto', maxWidth: 500, border: '1px dashed', borderColor: 'grey.400', backgroundColor: 'grey.50' }}>
          <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>No Transactions Found</Typography>
          <Typography color="text.secondary" paragraph>
            It looks like there's no data to display. Please <Link component={RouterLink} to="/">upload a CSV file</Link> to get started.
          </Typography>
          <Button component={RouterLink} to="/" variant="contained" sx={{mt: 2}} startIcon={<UploadFileIcon />}>
            Upload File
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{ maxHeight: 'calc(100vh - 250px)' }}> {/* Adjust max height based on viewport and other elements */}
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="transactions table">
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    backgroundColor: "primary.main",
                    color: "common.white",
                    fontWeight: 'bold',
                    py: 1.5
                  }
                }}
              >
                {headers.map(header => <TableCell key={header}>{header}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: (theme) => theme.palette.action.hover } }}
                >
                  {headers.map(header => (
                    <TableCell key={`${header}-${index}`} sx={{ py: 1, whiteSpace: 'nowrap' }}> {/* Prevent text wrapping for now, can be adjusted */}
                      {typeof transaction[header] === 'object' && transaction[header] !== null
                        ? JSON.stringify(transaction[header])
                        : String(transaction[header] === null || transaction[header] === undefined ? '' : transaction[header])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
export default DataView;
