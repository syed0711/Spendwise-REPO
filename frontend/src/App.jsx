// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, NavLink as RouterNavLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Typography, Box, Link as MuiLink } from '@mui/material'; // Added MuiLink for footer

// Updated imports to point to the components directory
import Home from './components/Home.jsx';
import DataView from './components/DataView.jsx';
import Dashboard from './components/Dashboard.jsx';

function App() {
  // Define styles for NavLink to avoid repetition
  const navButtonStyles = (isActive) => ({
    color: 'inherit',
    textTransform: 'none',
    fontSize: '1rem',
    fontWeight: isActive ? 'bold' : 500,
    mx: 0.5,
    backgroundColor: isActive ? 'primary.dark' : 'transparent',
    '&:hover': {
      backgroundColor: isActive ? 'primary.dark' : 'rgba(255, 255, 255, 0.08)',
    },
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: (theme) => theme.palette.grey[50] }}> {/* Added a light grey background */}
      <AppBar position="static" elevation={2}> {/* Added slight elevation */}
        <Container maxWidth="xl"> {/* Using xl for a wider layout if desired, or lg */}
          <Toolbar disableGutters> {/* disableGutters removes default padding if you want more control */}
            <Typography
              variant="h6"
              component={RouterNavLink}
              to="/"
              sx={{
                flexGrow: 1,
                fontWeight: 'bold',
                textDecoration: 'none',
                color: 'inherit',
                '&:hover': {color: 'inherit'}
              }}
            >
              SpendWise
            </Typography>
            <Button component={RouterNavLink} to="/" sx={({ isActive }) => navButtonStyles(isActive)}>Home</Button>
            <Button component={RouterNavLink} to="/data" sx={({ isActive }) => navButtonStyles(isActive)}>View Data</Button>
            <Button component={RouterNavLink} to="/dashboard" sx={({ isActive }) => navButtonStyles(isActive)}>Dashboard</Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="main" maxWidth="xl" sx={{ marginTop: {xs: 2, sm: 3, md: 4}, paddingBottom: {xs:2, sm:3, md: 4}, flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<DataView />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3, // Increased padding
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
          borderTop: (theme) => `1px solid ${theme.palette.divider}` // Added a top border
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            <MuiLink color="inherit" component={RouterLink} to="/">
              SpendWise
            </MuiLink>{' '}
            {new Date().getFullYear()}
            {'. All rights reserved.'}
          </Typography>
           <Typography variant="body2" color="text.secondary" align="center" sx={{mt: 0.5}}>
            Powered by React, MUI, Tailwind CSS, and Vite.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
export default App;
