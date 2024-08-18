import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.scss';

const Navbar = ({ title, handleLogout }) => {

    return (
        <header className="dashboard-header">
            <h1>{title}</h1>
            <nav>
                <Link to="/about" className="nav-link">About</Link>
                <Link to="/transactions" className="nav-link">Transactions</Link>
            </nav>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </header>
    );
};

export default Navbar;
