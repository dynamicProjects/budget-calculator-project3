import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import About from './components/About';
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
                    <Route path="/about" element={isAuthenticated ? <About handleLogout={handleLogout} /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
