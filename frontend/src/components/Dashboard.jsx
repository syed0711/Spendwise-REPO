import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import {
  Button, CircularProgress, Alert, Box, Typography, Paper, Grid, Card, CardContent, Link
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';


function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:4000/insights');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setInsights(data);
      } catch (e) {
        setError(e.message);
        console.error("Failed to fetch insights:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Box sx={{p:2}}>
        <Alert severity="error" sx={{ my: 2 }}>
          Error fetching insights: {error} <br/>
          Please ensure data is available and the backend server is running.
        </Alert>
        <Button variant="outlined" component={RouterLink} to="/data" sx={{mr:1}}>View Data</Button>
        <Button variant="outlined" component={RouterLink} to="/">Upload New File</Button>
      </Box>
    );
  }

  if (!insights || (insights.message && insights.totalSpent === 0 && Object.keys(insights.monthlyTotals || {}).length === 0 && Object.keys(insights.categoryBreakdown || {}).length === 0) ) {
    return (
      <Box sx={{p:2, textAlign: 'center'}}>
        <Paper sx={{ p: {xs: 2, sm: 4}, textAlign: 'center', mt: 4, backgroundColor: (theme) => theme.palette.grey[50] }}>
          <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {insights?.message || "No Insights Data Available"}
          </Typography>
          <Typography color="text.secondary" paragraph>
            There is no data to generate insights. This could be because no data has been uploaded,
            or the uploaded data might not contain the required fields (Date, Amount).
          </Typography>
          <Button variant="contained" component={RouterLink} to="/" sx={{ mt: 2 }}>
            Upload Transactions File
          </Button>
           <Button variant="outlined" component={RouterLink} to="/data" sx={{ mt: 2, ml:1 }}>
            View Raw Data
          </Button>
        </Paper>
      </Box>
    );
  }

  const { totalSpent, monthlyTotals, categoryBreakdown } = insights;

  const monthlyData = monthlyTotals && Object.keys(monthlyTotals).length > 0 ? Object.entries(monthlyTotals)
    .map(([name, value]) => ({ name, Amount: parseFloat(value) }))
    .sort((a, b) => new Date(a.name.split('-')[0], parseInt(a.name.split('-')[1]) - 1) - new Date(b.name.split('-')[0], parseInt(b.name.split('-')[1]) - 1))
    : [];

  const categoryData = categoryBreakdown && Object.keys(categoryBreakdown).length > 0 ? Object.entries(categoryBreakdown)
    .map(([name, value]) => ({ name, Amount: parseFloat(value) }))
    .sort((a, b) => b.Amount - a.Amount)
    : [];

  const hasAnyChartData = monthlyData.length > 0 || categoryData.length > 0;
  const hasTotalSpent = totalSpent !== undefined && totalSpent !== null;


  return (
    <Box sx={{ mt: 2, p: {xs: 1, sm: 2} }}>
      <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: {xs: 'center', sm: 'left'} }}>
          Financial Dashboard
        </Typography>
        <Button variant="outlined" component={RouterLink} to="/data">
          Back to Data View
        </Button>
      </Box>

      <Grid container spacing={3}>
        {hasTotalSpent && (
          <Grid item xs={12} md={hasAnyChartData ? 4 : 12}> {/* Full width if no other charts */}
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: (theme) => theme.palette.primary.lightest, p:2 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <MonetizationOnIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" color="text.secondary">Total Spent</Typography>
                <Typography variant="h3" component="p" sx={{ fontWeight: 'bold', color: 'primary.main', my: 1 }}>
                  ₹{Number(totalSpent).toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {monthlyData.length > 0 && (
          <Grid item xs={12} md={hasTotalSpent ? 8 : 12}> {/* Adjust width based on totalSpent card */}
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                    <TrendingUpIcon color="action" sx={{mr: 1}}/>
                    <Typography variant="h6">Monthly Trend</Typography>
                </Box>
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value}`} />
                      <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Amount"]} />
                      <Legend />
                      <Line type="monotone" dataKey="Amount" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {categoryData.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
                    <CategoryIcon color="action" sx={{mr: 1}}/>
                    <Typography variant="h6">Category Breakdown</Typography>
                </Box>
                <Box sx={{ height: 300, mt: 2 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value}`} />
                      <Tooltip formatter={(value) => [`₹${Number(value).toFixed(2)}`, "Amount"]} />
                      <Legend />
                      <Bar dataKey="Amount" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {!hasTotalSpent && !hasAnyChartData && (
            <Grid item xs={12}>
                 <Paper sx={{ p: {xs: 2, sm: 4}, textAlign: 'center', mt: 4, backgroundColor: (theme) => theme.palette.grey[50] }}>
                    <InfoOutlinedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>No Visualizations Available</Typography>
                    <Typography color="text.secondary" paragraph>
                        Could not generate insights. This usually means the uploaded data is missing essential columns like 'Date' or 'Amount',
                        or all amounts are zero. Please check your CSV file.
                    </Typography>
                    <Button variant="contained" component={RouterLink} to="/" sx={{ mt: 2, mr: 1 }}>Upload New File</Button>
                    <Button variant="outlined" component={RouterLink} to="/data" sx={{ mt: 2 }}>View Raw Data</Button>
                </Paper>
            </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Dashboard;
