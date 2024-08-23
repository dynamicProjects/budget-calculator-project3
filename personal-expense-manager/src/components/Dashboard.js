import React, { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import Navbar from './Navbar';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';
import '../styles/dashboard.scss';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const Dashboard = ({ handleLogout }) => {
    const [expenses, setExpenses] = useState([]);

    const addExpense = (expense) => {
        setExpenses([...expenses, expense]);
    };

    const totalExpense = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);
    const totalIncome = 83000;
    const afterTaxIncome = 59760;
    const dtiRatio = ((totalExpense / afterTaxIncome) * 100).toFixed(2);
    const frontEndDtiRatio = ((20000 / totalIncome) * 100).toFixed(2);

    // Prepare data for charts
    const expenseCategories = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(expenseCategories),
        datasets: [
            {
                label: 'Expenses',
                data: Object.values(expenseCategories),
                backgroundColor: '#42A5F5',
                borderColor: '#1E88E5',
                borderWidth: 1,
            },
        ],
    };

    const pieData = {
        labels: Object.keys(expenseCategories),
        datasets: [
            {
                data: Object.values(expenseCategories),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="dashboard">
            <Navbar
                title="Dashboard"
                handleLogout={handleLogout}
            />
            <div className="summary-section">
                <h2>Summary</h2>
                <table className="summary-table">
                    <tbody>
                        <tr>
                            <th></th>
                            <th>Annual</th>
                            <th>Monthly</th>
                        </tr>
                        <tr>
                            <td>Total Before Tax Income</td>
                            <td>$83,000</td>
                            <td>$6,917</td>
                        </tr>
                        <tr>
                            <td>Total After Tax Income</td>
                            <td>$59,760</td>
                            <td>$4,980</td>
                        </tr>
                        <tr>
                            <td>Total Expenses</td>
                            <td>${totalExpense}</td>
                            <td>${(totalExpense / 12).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td>Net (Deficit)</td>
                            <td>${(afterTaxIncome - totalExpense).toFixed(2)}</td>
                            <td>${((afterTaxIncome - totalExpense) / 12).toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="dti-section">
                <h2>Debt-to-Income (DTI) Ratio</h2>
                <p>DTI Ratio: <strong>{dtiRatio}%</strong> Your DTI ratio is {(dtiRatio < 30) ? 'good' : 'high'}.</p>
                <p>Front-End DTI Ratio: <strong>{frontEndDtiRatio}%</strong> housing costs by gross income.</p>
            </div>
            <div className="charts-container">
                <div className="chart-card">
                    <h3>Expense Breakdown</h3>
                    <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
                <div className="chart-card">
                    <h3>Expense Distribution</h3>
                    <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
                </div>
            </div>
            <AddExpense addExpense={addExpense} />
            <ExpenseList expenses={expenses} />
        </div>
    );
};

export default Dashboard;
