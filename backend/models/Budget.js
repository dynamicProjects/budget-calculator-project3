const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        enum: ["Monthly", "Annual"],
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Assuming there's a User model for authentication
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;