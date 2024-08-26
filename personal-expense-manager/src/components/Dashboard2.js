import React, { useEffect, useState } from "react";
import { Pie, Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement } from 'chart.js';
import axios from "axios";
import moment from "moment";
import { Row, Col, Card } from "react-bootstrap";
import Navbar from './Navbar';
import '../styles/dashboard.scss';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement);

const Dashboard = ({ handleLogout }) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [recentTransactions, setRecentTransactions] = useState([]);

    useEffect(() => {
        // Fetch transactions from the backend
        const fetchTransactions = async () => {
            try {
                const response = await axios.get("https://budget-calculator-project3.onrender.com/api/transactions", { withCredentials: true });
                setTransactions(response.data);

                // Calculate summary
                const income = response.data
                    .filter((transaction) => transaction.type === "Credit")
                    .reduce((sum, transaction) => sum + transaction.amount, 0);
                const expense = response.data
                    .filter((transaction) => transaction.type === "Debit")
                    .reduce((sum, transaction) => sum + transaction.amount, 0);
                const balance = income - expense;

                setSummary({ income, expense, balance });

                // Get recent transactions from the past 5 days
                const recent = response.data.filter((transaction) =>
                    moment(transaction.date).isAfter(moment().subtract(5, "days"))
                );
                setRecentTransactions(recent);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    // Chart data
    const pieData = {
        labels: ["Income", "Expenses"],
        datasets: [
            {
                label: "Income vs Expenses",
                data: [summary.income, summary.expense],
                backgroundColor: ["#36A2EB", "#FF6384"],
            },
        ],
    };

    const lineData = {
        labels: transactions.map((transaction) => moment.utc(transaction.date).format("MMM DD")),
        datasets: [
            {
                label: "Expenses Over Time",
                data: transactions.map((transaction) => transaction.amount),
                fill: false,
                backgroundColor: "#FF6384",
                borderColor: "#FF6384",
            },
        ],
    };

    const barData = {
        labels: transactions.map((transaction) => moment.utc(transaction.date).format("MMM DD")),
        datasets: [
            {
                label: "Daily Expenses",
                data: transactions.map((transaction) => transaction.amount),
                backgroundColor: "#FF6384",
            },
        ],
    };

    // Simple forecast for demonstration
    const forecast = summary.expense * 1.1; // 10% increase as a simple forecast model

    return (
        <div className="dashboard">
            <Navbar
                title="Dashboard"
                handleLogout={handleLogout}
            />
            <div className="mt-5">
                <Row>
                    <Col md="4">
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Total Income</Card.Title>
                                <Card.Text>${summary.income.toFixed(2)}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Total Expenses</Card.Title>
                                <Card.Text>${summary.expense.toFixed(2)}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Balance</Card.Title>
                                <Card.Text>${summary.balance.toFixed(2)}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-4 justify-content-center align-items-center">
                    <Col md="4">
                        <Card>
                            <Card.Body>
                                <Card.Title>Income vs Expenses</Card.Title>
                                <Pie data={pieData} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="8">
                        <Card>
                            <Card.Body>
                                <Card.Title>Expenses Over Time</Card.Title>
                                <Line data={lineData} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md="12">
                        <Card>
                            <Card.Body>
                                <Card.Title>Daily Expenses</Card.Title>
                                <Bar data={barData} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md="12">
                        <Card>
                            <Card.Body>
                                <Card.Title>Forecast (Next Month)</Card.Title>
                                <Card.Text>
                                    Based on your past expenses, the forecast for next month is: ${forecast.toFixed(2)}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col md="12">
                        <Card>
                            <Card.Body>
                                <Card.Title>Recent Transactions</Card.Title>
                                <ul className="list-group">
                                    {recentTransactions.map((transaction) => (
                                        <li key={transaction._id} className="list-group-item d-flex justify-content-between align-items-center">
                                            {transaction.category} - ${transaction.amount.toFixed(2)}
                                            <span className="badge badge-primary badge-pill">{moment.utc(transaction.date).format("MMM DD, YYYY")}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Dashboard;
