import React from 'react';
import Navbar from './Navbar';
import '../styles/about.scss';

import aboutImage from '../assets/images/about-image.png';


const Debts = ({ handleLogout }) => {
    return (
        <div className="about-container">
            <div className="about-header">
                <Navbar title="Debts" handleLogout={handleLogout}/>
            </div>
            <div className="about-content">
                <div className="about-image">
                <img src={aboutImage} alt="Budget planning" className="about-image" />
                </div>
                <div className="about-text">
                    <p>
                        The Budget Calculator is a modern and user-friendly tool designed to empower you with financial
                        insights. By tracking your income and expenses, this tool provides a comprehensive view of your financial
                        health, helping you make informed decisions.
                    </p>
                    <p>
                        Our features include detailed expense categorization, interactive charts, and customizable settings to
                        ensure that managing your finances is both effective and efficient. Whether you're planning for the future
                        or monitoring your current spending, the Budget Calculator is here to support you.
                    </p>
                    <p>
                        We continuously strive to enhance your experience and welcome any feedback or suggestions. Your journey to
                        financial stability starts here.
                    </p>
                </div>
            </div>
        </div>
    );
};
export default Debts;

