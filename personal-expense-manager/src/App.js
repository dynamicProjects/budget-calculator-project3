import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import About from './components/About';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Calendar from './components/Calendar';
import Register from "./components/Register";

import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login handleLogin={handleLogin} />} />
                    <Route path="/dashboard" element={isAuthenticated ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/" />} />
                    <Route path="/transactions" element={isAuthenticated ? <Transactions handleLogout={handleLogout} /> : <Navigate to="/" />} />
                    <Route path="/budgets" element={isAuthenticated ? <Budgets handleLogout={handleLogout} /> : <Navigate to="/" />} />
                    <Route path="/calendar" element={isAuthenticated ? <Calendar handleLogout={handleLogout} /> : <Navigate to="/" />} />
                    <Route path="/about" element={isAuthenticated ? <About handleLogout={handleLogout} /> : <Navigate to="/" />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
