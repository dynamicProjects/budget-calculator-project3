import React from 'react';
import { Link } from 'react-router-dom';
import expenseLogo from '../assets/images/expense-manager.png';
import '../styles/navbar.scss';

const Navbar = ({ title, handleLogout }) => {

    return (
        <header className="dashboard-header sticky-top">
            <Link to="/" className="nav-link">
                <img src={expenseLogo} alt="Logo" className="mx-2 homeLogo"/>
            </Link>
            <h4 className='m-3'>{title}</h4>
            <nav>
                <Link to="/" className="nav-link">Dashboard</Link>
                <Link to="/transactions" className="nav-link">Transactions</Link>
                <Link to="/budgets" className="nav-link">Budgets</Link>
                <Link to="/calendar" className="nav-link">Calendar</Link>
                <Link to="/about" className="nav-link">About</Link>
            </nav>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </header>
    );
};

export default Navbar;
