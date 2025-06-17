// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Button, CircularProgress, Alert, Box, Typography, Paper, Grid, Card, CardContent, AlertTitle, Stack } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DataUsageIcon from '@mui/icons-material/DataUsage';


function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}><CircularProgress size={60} /></Box>;
  }

  if (error) {
     return (
      <Paper component={Box} p={3} elevation={3} sx={{ textAlign: 'center', mt: {xs:2, sm:4}, mx: 'auto', maxWidth: 600 }}>
        <Alert severity="error" icon={<InfoOutlinedIcon sx={{ fontSize: 30 }}/>} sx={{ justifyContent: 'center', py: 2, mb:2, flexDirection: 'column', alignItems: 'center', gap:1 }}>
            <AlertTitle sx={{fontWeight: 'bold'}}>Error Loading Insights</AlertTitle>
            {error}
        </Alert>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button component={RouterLink} to="/data" variant="outlined" startIcon={<DataUsageIcon />}>View Data</Button>
          <Button onClick={fetchInsights} variant="outlined">Try Again</Button>
        </Stack>
      </Paper>
    );
  }

  if (!insights || insights.message || (insights.totalSpent === 0 && Object.keys(insights.monthlyTotals || {}).length === 0 && Object.keys(insights.categoryBreakdown || {}).length === 0)) {
    return (
      <Paper component={Box} p={{xs:2, sm:4}} elevation={1} sx={{ textAlign: 'center', mt: 4, mx: 'auto', maxWidth: 500, border: '1px dashed', borderColor: 'grey.400', backgroundColor: 'grey.50' }}>
          <AssessmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>No Insights Available</Typography>
          <Typography color="text.secondary" paragraph>
            {insights?.message || "Could not retrieve financial insights. Please ensure you have uploaded transaction data with 'Date' and 'Amount' columns."}
          </Typography>
          <Button component={RouterLink} to="/" variant="contained" sx={{mt: 2}}>Upload Data</Button>
      </Paper>
    );
  }

  const { totalSpent, monthlyTotals, categoryBreakdown } = insights;

  const monthlyData = monthlyTotals && Object.keys(monthlyTotals).length > 0 ? Object.entries(monthlyTotals)
    .map(([name, value]) => ({ name, Amount: parseFloat(value) || 0 }))
    .sort((a,b) => new Date(a.name.split('-')[0], parseInt(a.name.split('-')[1]) - 1) - new Date(b.name.split('-')[0], parseInt(b.name.split('-')[1]) - 1))
    : [];

  const categoryData = categoryBreakdown && Object.keys(categoryBreakdown).length > 0 ? Object.entries(categoryBreakdown)
    .map(([name, value]) => ({ name, Amount: parseFloat(value) || 0 }))
    .sort((a,b) => b.Amount - a.Amount) // Sort by amount descending for bar chart
    : [];

  const hasMonthlyData = monthlyData.length > 0;
  const hasCategoryData = categoryData.length > 0;

  const formatCurrency = (value) => `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatAxisCurrency = (value) => `₹${Number(value).toLocaleString('en-IN')}`;


  return (
    <Box sx={{ mt: {xs:1, sm:2}, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: {xs:2, sm:3}, flexWrap: 'wrap', gap:2 }}>
        <Typography variant="h4" component="h1" sx={{fontWeight: 'medium'}}>
          Financial Dashboard
        </Typography>
        <Button variant="outlined" component={RouterLink} to="/data" startIcon={<DataUsageIcon />}>
          Back to Data View
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={3} sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
            <CardContent sx={{ textAlign: 'center', p: {xs:2, sm:3} }}>
              <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', mb:1}}>
                <AttachMoneyIcon sx={{ fontSize: {xs: 30, sm: 36}, mr: 1 }} />
                <Typography variant="h6" component="div" sx={{fontWeight:'medium'}}>Total Spent</Typography>
              </Box>
              <Typography variant="h3" component="p" sx={{ fontWeight: 'bold' }}>
                {formatCurrency(totalSpent)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {hasMonthlyData && (
          <Grid item xs={12} lg={hasCategoryData ? 7 : 12}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{display: 'flex', alignItems: 'center', mb:1}}>
                    <TrendingUpIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6" component="div">Monthly Trend</Typography>
                </Box>
                <Box sx={{ height: 380, mt: 2 }}> {/* Increased height slightly */}
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 25, bottom: 5 }}> {/* Adjusted left margin */}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={formatAxisCurrency} />
                      <Tooltip formatter={(value) => [formatCurrency(value), "Amount"]} />
                      <Legend />
                      <Line type="monotone" dataKey="Amount" strokeWidth={2} stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {hasCategoryData && (
          <Grid item xs={12} lg={hasMonthlyData ? 5 : 12}>
            <Card elevation={2}>
              <CardContent>
                 <Box sx={{display: 'flex', alignItems: 'center', mb:1}}>
                    <CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6" component="div">Category Breakdown</Typography>
                </Box>
                 <Box sx={{ height: 380, mt: 2 }}> {/* Increased height slightly */}
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}> {/* Ensure enough left margin for YAxis labels */}
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={formatAxisCurrency} />
                      <YAxis dataKey="name" type="category" width={120} interval={0} style={{fontSize: '0.9rem'}} /> {/* Adjusted width and font size */}
                      <Tooltip formatter={(value) => [formatCurrency(value), "Amount"]} />
                      <Legend />
                      <Bar dataKey="Amount" fill="#82ca9d" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {!hasMonthlyData && !hasCategoryData && Number(totalSpent) > 0 && (
             <Grid item xs={12}>
                <Paper component={Box} p={3} elevation={1} sx={{textAlign: 'center', mt:2, border: '1px dashed', borderColor: 'grey.400', backgroundColor: 'grey.50'}}>
                    <InfoOutlinedIcon sx={{ fontSize: 30, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="subtitle1" sx={{ color: 'text.secondary'}}>
                        Additional charts for monthly trends and category breakdown require 'Date' and 'Category' columns with valid data in your CSV.
                    </Typography>
                </Paper>
            </Grid>
        )}
      </Grid>
    </Box>
  );
}
export default Dashboard;
