import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';

import Home from './components/Home';
import DataView from './components/DataView';
import Dashboard from './components/Dashboard'; // UPDATED


function App() {
  return (
    <div className="App">
      <nav>
        <ul>
          <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} end>Home</NavLink></li>
          <li><NavLink to="/data" className={({ isActive }) => isActive ? 'active' : ''}>View Data</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
        </ul>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<DataView />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
