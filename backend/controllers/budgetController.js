const Budget = require("../models/Budget");

// Get all budgets for a specific user
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ userId: req.user._id });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: "Error fetching budgets" });
    }
};

// Add a new budget
exports.addBudget = async (req, res) => {
    const { category, amount, duration } = req.body;

    try {
        const newBudget = new Budget({
            category,
            amount,
            duration,
            userId: req.user._id,
        });

        await newBudget.save();
        res.status(201).json(newBudget);
    } catch (error) {
        res.status(500).json({ message: "Error adding budget" });
    }
};

// Update an existing budget
exports.updateBudget = async (req, res) => {
    const { id } = req.params;
    const { category, amount, duration } = req.body;

    try {
        const updatedBudget = await Budget.findByIdAndUpdate(
            id,
            { category, amount, duration },
            { new: true }
        );

        if (!updatedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.json(updatedBudget);
    } catch (error) {
        res.status(500).json({ message: "Error updating budget" });
    }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBudget = await Budget.findByIdAndDelete(id);

        if (!deletedBudget) {
            return res.status(404).json({ message: "Budget not found" });
        }

        res.json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting budget" });
    }
};
