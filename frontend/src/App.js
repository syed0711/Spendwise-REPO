import React from 'react';
import { Routes, Route, NavLink as RouterNavLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Container, Typography, Box } from '@mui/material';

// Original CSS import, can be reviewed later if all styles are handled by MUI
import './App.css';

// Components
import Home from './components/Home';
// Placeholders for DataView and Dashboard. These will be refactored in subsequent subtasks.
// For now, to avoid breaking the app, we'll use the existing simple placeholders
// if the actual files haven't been created or aren't MUI yet.
// Assuming DataView and Dashboard components exist as defined in previous steps.
import DataView from './components/DataView';
import Dashboard from './components/Dashboard';

// const DataView = () => <Typography variant="h2">Data View Page (MUI Placeholder)</Typography>;
// const Dashboard = () => <Typography variant="h2">Dashboard Page (MUI Placeholder)</Typography>;


function App() {
  const navLinkStyle = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none',
    color: 'inherit',
    marginRight: 2, // theme.spacing(2) equivalent when theme is available directly
    padding: '6px 8px', // MUI Button default padding is similar
    '&.active': {
      // For MUI Button, we can use sx prop to conditionally apply styles based on NavLink's isActive.
      // However, NavLink's className prop is simpler for direct active styling if not overriding MUI Button's own active/hover states.
      // The sx prop on Button component with RouterNavLink is a more MUI-integrated way.
      backgroundColor: 'rgba(255, 255, 255, 0.15)', // Example active style
      borderRadius: '4px', // Match button's border radius
    }
  });


  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SpendWise
          </Typography>
          {/*
            The `component={RouterNavLink}` prop tells the MUI Button to render as a react-router NavLink.
            The `to` prop is passed to the NavLink.
            The `sx` prop is used for styling, including active state.
          */}
          <Button
            color="inherit"
            component={RouterNavLink}
            to="/"
            sx={navLinkStyle}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterNavLink}
            to="/data"
            sx={navLinkStyle}
          >
            View Data
          </Button>
          <Button
            color="inherit"
            component={RouterNavLink}
            to="/dashboard"
            sx={navLinkStyle}
          >
            Dashboard
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 3, marginBottom: 3 }}> {/* Added marginBottom for spacing */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<DataView />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
