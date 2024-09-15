import React from 'react';
import './App.css';
import HomePage from './Pages/HomePage';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import LoginPage from './Pages/login';
import SignUpPage from './Pages/signup';

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        {/* Default route */}
        <Route path="/" element={<HomePage />} />
        <Route path="/chat/:chatId" element={<HomePage />} />
        {/* Login route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
