import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Keep for now, can be reviewed later
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline'; // Adds baseline styles

// Default theme, can be customized
const theme = createTheme({
  palette: {
    // mode: 'light', // or 'dark'
    // Example customizations:
    // primary: {
    //   main: '#1976d2',
    // },
    // secondary: {
    //   main: '#dc004e',
    // },
  },
  // You can also customize typography, spacing, breakpoints, etc.
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize styles and apply background color from theme */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
