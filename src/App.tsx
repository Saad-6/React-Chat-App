import React from 'react';
import logo from './logo.svg';
import './App.css';
import HomePage from './Pages/HomePage';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import LoginPage from './Pages/login';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        {/* Default route */}
        <Route path="/" element={<HomePage />} />
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
