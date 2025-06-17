import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Button, CircularProgress, Alert, Box, Typography, Paper,
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Link
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Using outlined version

function DataView() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
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

    fetchTransactions();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ my: 2 }}>
          Error fetching transactions: {error} <br />
          Please ensure the backend server is running and accessible.
        </Alert>
        <Button variant="outlined" component={RouterLink} to="/">Go to Upload Page</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2, p: {xs: 1, sm: 2} }}> {/* Added responsive padding */}
      <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: {xs: 'center', sm: 'left'} }}>
          Transaction Data
        </Typography>
        <Box sx={{ display: 'flex', gap: 1}}>
            <Button variant="outlined" component={RouterLink} to="/">Upload New File</Button>
            <Button variant="contained" component={RouterLink} to="/dashboard">View Dashboard</Button>
        </Box>
      </Box>
      {transactions.length === 0 ? (
        <Paper sx={{ p: {xs: 2, sm: 4}, textAlign: 'center', mt: 4, backgroundColor: (theme) => theme.palette.grey[50] }}>
          <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>No Transactions Found</Typography>
          <Typography color="text.secondary" paragraph>
            It looks like there's no data to display.
            Please <Link component={RouterLink} to="/">upload a CSV file</Link> on the Home page.
          </Typography>
          <Button variant="contained" component={RouterLink} to="/" sx={{ mt: 2 }}>
            Upload File
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}> {/* Added maxHeight for scrollability within TableContainer */}
          <Table stickyHeader sx={{ minWidth: 650 }} aria-label="transactions table">
            <TableHead>
              <TableRow sx={{ '& th': { backgroundColor: (theme) => theme.palette.grey[200], fontWeight: 'bold' } }}>
                {headers.map(header => <TableCell key={header}>{header}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow
                  key={index}
                  sx={{
                    '&:nth-of-type(odd)': { backgroundColor: (theme) => theme.palette.action.hover },
                    '&:last-child td, &:last-child th': { border: 0 }
                  }}
                >
                  {headers.map(header => (
                    <TableCell key={`${header}-${index}`}>
                      {typeof transaction[header] === 'object' ? JSON.stringify(transaction[header]) : String(transaction[header])}
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
