import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form, ProgressBar } from "react-bootstrap";
import Navbar from './Navbar';
import '../styles/budgets.scss';

const Budgets = ({ handleLogout }) => {
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("Add"); // 'Add' or 'Edit'
    const [currentBudget, setCurrentBudget] = useState(null);
    const [formData, setFormData] = useState({
        category: "Eating Out",
        amount: "",
        duration: "Monthly", // Default duration
    });
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const debitCategoriesArray = [
        "Eating Out",
        "Shopping",
        "Transportation",
        "Entertainment",
        "Rent",
        "Utility",
        "Other (Home)",
        "Family",
        "Health/Sport",
        "Pets",
        "Travel",
        "Debt Payment",
        "Other (Expenses)"];

    useEffect(() => {
        fetchBudgets();
        fetchTransactions();
    }, []);

    const fetchBudgets = async () => {
        const baseURL = process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "https://budget-calculator-project3.onrender.com";
        try {
            const response = await axios.get(`${baseURL}/api/budgets`, { withCredentials: true });
            setBudgets(response.data);
        } catch (error) {
            console.error("Error fetching budgets:", error);
        }
    };

    const fetchTransactions = async () => {
        const baseURL = process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "https://budget-calculator-project3.onrender.com";
        try {
            const response = await axios.get(`${baseURL}/api/transactions`, { withCredentials: true });
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const calculateSpentAmount = (category, duration) => {
        return transactions.reduce((acc, transaction) => {
            const transactionDate = new Date(transaction.date);
            const isWithinBudgetPeriod = duration === "Monthly"
                ? transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
                : transactionDate.getFullYear() === now.getFullYear();
            if (transaction.category === category && isWithinBudgetPeriod) {
                return acc + parseFloat(transaction.amount);
            }
            return acc;
        }, 0);
    };

    const getProgressBarVariant = (spent, budgeted) => {
        const percentage = (spent / budgeted) * 100;
        if (percentage < 80) return "success";
        if (percentage < 95) return "warning";
        return "danger";
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const baseURL = process.env.NODE_ENV === "development"
            ? "http://localhost:5000"
            : "https://budget-calculator-project3.onrender.com";
        try {
            if (modalMode === "Add") {
                await axios.post(`${baseURL}/api/budgets`, formData, { withCredentials: true });
            } else {
                await axios.put(`${baseURL}/api/budgets/${currentBudget._id}`, formData, { withCredentials: true });
            }
            fetchBudgets();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving budget:", error);
        }
    };

    const handleEditBudget = (budget) => {
        setModalMode("Edit");
        setCurrentBudget(budget);
        setFormData({
            category: budget.category,
            amount: budget.amount,
            duration: budget.duration,
        });
        setShowModal(true);
    };

    const handleDeleteBudget = async (budgetId) => {
        const baseURL = process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "https://budget-calculator-project3.onrender.com";
        try {
            await axios.delete(`${baseURL}/api/budgets/${budgetId}`, { withCredentials: true });
            fetchBudgets();
        } catch (error) {
            console.error("Error deleting budget:", error);
        }
    };

    return (
        <div className="budgets">
            <div className="header">
                <Navbar title="Budgets" handleLogout={handleLogout} />
            </div>
            <div className="budgets-section">
                {/* Display Budgets */}
                <div className="budget-list mt-4">
                    {budgets.map((budget) => {
                        const spent = calculateSpentAmount(budget.category, budget.duration);
                        const progressVariant = getProgressBarVariant(spent, budget.amount);
                        const durationDate = budget.duration === "Monthly"
                            ? now.getMonth() + 1 + "/1/" + now.getFullYear() + " - " + (now.getMonth() + 1) + "/" + lastDayOfMonth + "/" + now.getFullYear()
                            : "1/1/" + now.getFullYear() + " - 12/31/" + now.getFullYear();
                        return (
                            <div key={budget._id} className="budget-item mb-3">
                                <h5>{budget.category} ({budget.duration})</h5>
                                <p className="budget-date">{durationDate}</p>
                                <ProgressBar
                                    now={(spent / budget.amount) * 100}
                                    variant={progressVariant}
                                    label={`$${(spent)} / $${budget.amount}`}
                                />
                                <div className="mt-2">
                                    <Button variant="warning" size="sm" onClick={() => handleEditBudget(budget)}>Edit</Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDeleteBudget(budget._id)} className="mx-2">Delete</Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Add Budget Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalMode === "Add" ? "Add Budget" : "Edit Budget"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="formCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="category"
                                    className="mb-3"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {
                                        debitCategoriesArray.map(val => (
                                            <option key={val} value={val}>{val}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formAmount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="amount"
                                    className="mb-3"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formDuration">
                                <Form.Label>Duration</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="duration"
                                    className="mb-3"
                                    value={formData.duration}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Monthly">Monthly</option>
                                    <option value="Annual">Annual</option>
                                </Form.Control>
                            </Form.Group>
                            <Button variant="primary" type="submit" className="mt-3">
                                {modalMode === "Add" ? "Add Budget" : "Save Changes"}
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Floating Action Button for Adding Budgets */}
                <div className="fab-container">
                    <Button
                        variant="primary"
                        className="fab"
                        onClick={() => {
                            setModalMode("Add");
                            setFormData({ category: "Eating Out", amount: "", duration: "Monthly" });
                            setShowModal(true);
                        }}
                    >
                        <strong>+</strong>
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default Budgets;

