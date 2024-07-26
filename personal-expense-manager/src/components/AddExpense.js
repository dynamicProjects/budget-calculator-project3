import React, { useState } from 'react';
import '../styles/addExpense.scss';

const AddExpense = ({ addExpense }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Housing & Utilities');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!description || !amount) return;
        addExpense({ description, amount, category });
        setDescription('');
        setAmount('');
        setCategory('Housing & Utilities');
    };

    return (
        <form onSubmit={handleSubmit} className="add-expense-form">
            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="form-input"
            />
            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="form-input"
            />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="form-input"
            >
                <option value="Housing & Utilities">Housing & Utilities</option>
                <option value="Transportation">Transportation</option>
                <option value="Food & Meals">Food & Meals</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Savings & Investments">Savings & Investments</option>
                <option value="Miscellaneous">Miscellaneous</option>
            </select>
            <button type="submit" className="form-button">Add Expense</button>
        </form>
    );
};

export default AddExpense;
