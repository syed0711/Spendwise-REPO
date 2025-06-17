import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function DataView() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null); // Reset error state on new fetch
      try {
        const response = await fetch('http://localhost:4000/transactions');
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTransactions(data);
        if (data && data.length > 0) {
          // Ensure consistent header order if possible, or just use keys from first object
          // For more complex scenarios, you might want to predefine headers or derive them more robustly
          setHeaders(Object.keys(data[0]));
        } else {
          setHeaders([]); // No headers if no data
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
    return <p>Loading transactions...</p>;
  }

  if (error) {
    return (
      <div>
        <p>Error fetching transactions: {error}</p>
        <Link to="/">
          <button>Go to Upload</button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2>Transaction Data</h2>
      <Link to="/dashboard">
        <button style={{ marginRight: '10px' }}>View Dashboard</button>
      </Link>
      <Link to="/">
        <button>Upload New File</button>
      </Link>
      {transactions.length === 0 ? (
        <p style={{ marginTop: '20px' }}>No transactions found. <Link to="/">Upload a CSV file</Link> on the Home page.</p>
      ) : (
        <div className="scrollable-table">
          <table>
            <thead>
              <tr>
                {headers.map(header => <th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  {headers.map(header => (
                    <td key={`${header}-${index}`}>
                      {typeof transaction[header] === 'object' ? JSON.stringify(transaction[header]) : String(transaction[header])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DataView;
