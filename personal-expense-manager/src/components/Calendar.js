import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import axios from "axios";
import { Alert } from "react-bootstrap";
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar.scss';
import Navbar from './Navbar';

const SpendingCalendar = ({ handleLogout }) => {
    const [date, setDate] = useState(new Date());
    const [spendingByDate, setSpendingByDate] = useState({});
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch transactions from the backend
        const fetchTransactions = async () => {
            const baseURL = process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "https://budget-calculator-project3.onrender.com";
            try {
                const response = await axios.get(`${baseURL}/api/transactions`, { withCredentials: true });

                // Calculate spending by date
                const spendingMap = {};
                response.data.forEach(transaction => {
                    const date = moment(new Date(transaction.date).toLocaleDateString('en-US', { timeZone: 'UTC' })).format("YYYY-MM-DD");
                    if (!spendingMap[date]) {
                        spendingMap[date] = 0;
                    }
                    spendingMap[date] += transaction.type === "Debit" ? -transaction.amount : transaction.amount;
                });
                setSpendingByDate(spendingMap);
            } catch (error) {
                console.error("Error fetching transactions:", error);
                setError("Could not fetch transactions. Please try again later.");
            }
        };

        fetchTransactions();
    }, []);

    const tileContent = ({ date, view }) => {
        const formattedDate = moment(date).format("YYYY-MM-DD");
        if (view === "month" && spendingByDate[formattedDate]) {
            return (
                <div className="spending-amount">
                    ${spendingByDate[formattedDate].toFixed(2)}
                </div>
            );
        }
    };

    return (
        <div className="calendar-container">
            <div className="header">
                <Navbar title="Calendar" handleLogout={handleLogout} />
            </div>
            <div className="calendar-section">
                {error && <Alert variant="danger">{error}</Alert>}
                <Calendar
                    onChange={setDate}
                    value={date}
                    className="calendar-main container-fluid"
                    tileContent={tileContent}
                    tileClassName={({ date, view }) => {
                        const formattedDate = moment(date).format("YYYY-MM-DD");
                        if (view === "month" && spendingByDate[formattedDate]) {
                            const amount = spendingByDate[formattedDate];
                            if (amount > 0) return "credit-day";
                            if (amount < 0) return "debit-day";
                        }
                        return null;
                    }}
                />
            </div>
        </div>
    );
};
export default SpendingCalendar;

