// frontend/src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App.jsx'; // Ensure App.jsx is created or updated
import './index.css'; // Import Tailwind styles and other global styles

const theme = createTheme({
  // MUI theme customizations can go here if desired later
  // palette: { primary: { main: '#1976d2' } }
  // typography: {
  //   fontFamily: [
  //     // Add Tailwind's default sans-serif stack here if you want MUI components to match
  //     // '-apple-system', 'BlinkMacSystemFont', ...
  //   ].join(','),
  // },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* MUI's baseline styles, including background and font based on theme */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
