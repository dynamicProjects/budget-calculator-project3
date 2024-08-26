const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addTransaction = async (req, res) => {
    const { date, description, amount, type, category } = req.body;

    try {
        const transaction = new Transaction({
            user: req.user._id,
            date,
            category,
            description,
            amount,
            type,
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getTransactions, addTransaction };