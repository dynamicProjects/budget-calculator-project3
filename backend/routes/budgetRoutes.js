const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");
const { ensureAuthenticated } = require("../middlewares/authMiddleware");

// GET all budgets for a specific user
router.get("/", ensureAuthenticated, budgetController.getBudgets);

// POST a new budget
router.post("/", ensureAuthenticated, budgetController.addBudget);

// PUT (update) an existing budget
router.put("/:id", ensureAuthenticated, budgetController.updateBudget);

// DELETE a budget
router.delete("/:id", ensureAuthenticated, budgetController.deleteBudget);

module.exports = router;
