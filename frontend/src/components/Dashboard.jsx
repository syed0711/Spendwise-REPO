import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

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
    return <p>Loading insights...</p>;
  }

  if (error) {
    return <p>Error fetching insights: {error}. <Link to="/data">Try reloading data</Link> or <Link to="/">upload new data</Link>.</p>;
  }

  if (!insights || (insights.message && !insights.totalSpent)) { // Check for message from backend indicating no data
    return (
        <div>
            <p>{insights?.message || "No insights data available. All transactions might have been invalid or the file was empty."}</p>
            <Link to="/">
                <button>Upload New File</button>
            </Link>
        </div>
    );
  }

  const { totalSpent, monthlyTotals, categoryBreakdown } = insights;

  const monthlyData = monthlyTotals && Object.keys(monthlyTotals).length > 0 ? Object.entries(monthlyTotals)
    .map(([name, value]) => ({ name, Amount: parseFloat(value) })) // Ensure Amount is a number
    .sort((a,b) => new Date(a.name.split('-')[0], parseInt(a.name.split('-')[1]) - 1) - new Date(b.name.split('-')[0], parseInt(b.name.split('-')[1]) - 1)) // Sort by YYYY-MM
    : [];

  const categoryData = categoryBreakdown && Object.keys(categoryBreakdown).length > 0 ? Object.entries(categoryBreakdown)
    .map(([name, value]) => ({ name, Amount: parseFloat(value) })) // Ensure Amount is a number
    .sort((a,b) => b.Amount - a.Amount) // Sort by amount desc
    : [];

  const hasDataForCharts = monthlyData.length > 0 || categoryData.length > 0 || (totalSpent !== undefined && totalSpent !== null && totalSpent > 0);


  return (
    <div>
      <h2>Dashboard</h2>
      <Link to="/data">
        <button style={{ marginBottom: '20px' }}>Back to Data View</button>
      </Link>

      {!hasDataForCharts && insights.message && (
         <p>{insights.message}</p>
      )}
      {!hasDataForCharts && !insights.message && (
         <p>No data processed for insights. Please ensure your CSV has 'Date', 'Amount' and optionally 'Category' columns with valid data. <Link to="/">Upload a new file.</Link></p>
      )}

      { (totalSpent !== undefined && totalSpent !== null) &&
        <section style={{ marginTop: '20px', marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ margin: '0', color: '#333' }}>Total Spent: <span style={{ color: '#28a745' }}>₹{Number(totalSpent).toFixed(2)}</span></h3>
        </section>
      }


      {monthlyData.length > 0 && (
        <section style={{ marginBottom: '40px' }}>
          <h3>Monthly Trend</h3>
          <ResponsiveContainer width="95%" height={300}>
            <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="Amount" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </section>
      )}

      {categoryData.length > 0 && (
        <section>
          <h3>Category Breakdown</h3>
          <ResponsiveContainer width="95%" height={300}>
            <BarChart data={categoryData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} />
              <Legend />
              <Bar dataKey="Amount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
    </div>
  );
}

export default Dashboard;
