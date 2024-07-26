import React from 'react';
import '../styles/expenseList.scss';

const ExpenseList = ({ expenses }) => {
    return (
        <div className="expense-list">
            <h2>Expenses</h2>
            <ul>
                {expenses.map((expense, index) => (
                    <li key={index} className="expense-item">
                        <span className="expense-description">{expense.description}:</span>
                        <span className="expense-amount">${expense.amount}</span>
                        <span className="expense-category">({expense.category})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpenseList;
