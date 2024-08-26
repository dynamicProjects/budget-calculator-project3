import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Form, Dropdown, ButtonGroup } from "react-bootstrap";
import moment from "moment";
import Navbar from './Navbar';
import '../styles/transactions.scss';

const Transactions = ({ handleLogout }) => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        date: "",
        category: "",
        description: "",
        amount: "",
        type: "Credit", // Default to Credit
    });
    const [transactionType, setTransactionType] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [currentMonth, setCurrentMonth] = useState(moment().startOf("month"));

    useEffect(() => {
        fetchTransactions();
    }, [currentMonth, transactionType, selectedCategory]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/transactions",
                { withCredentials: true }
            );
            const filteredTransactions = response.data.filter((transaction) => {
                const transactionDate = moment(new Date(transaction.date).toLocaleDateString('en-US', { timeZone: 'UTC' }));
                const isSameMonth = transactionDate.isSame(currentMonth, "month");

                const matchesType =
                    transactionType === "All" || transaction.type === transactionType;
                const matchesCategory =
                    selectedCategory === "All" ||
                    transaction.category === selectedCategory;

                return isSameMonth && matchesType && matchesCategory;
            });

            // Sort transactions by date in descending order
            const sortedTransactions = filteredTransactions.sort(
                (a, b) => new Date(b.date) - new Date(a.date)
            );

            setTransactions(sortedTransactions);
        } catch (err) {
            setError("Failed to fetch transactions. Please try again.");
        }
    };

    // Calculate the balance amount
    const calculateBalance = () => {
        return transactions.reduce((acc, transaction) => {
            const amount = parseFloat(transaction.amount);
            return transaction.type === "Credit" ? acc + amount : acc - amount;
        }, 0);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/transactions", formData, {
                withCredentials: true,
            });
            fetchTransactions(); // Refresh transactions after adding a new one
            setShowModal(false); // Close modal after successful addition
        } catch (err) {
            setError("Failed to add transaction. Please try again.");
        }
    };

    const handleMonthChange = (direction) => {
        setCurrentMonth(
            currentMonth.clone().add(direction === "next" ? 1 : -1, "months")
        );
    };

    const creditCategoriesArray = ["Salary", "Side Jobs", "Pension", "Other (Income)"];
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
        "Other (Expenses)"];

    const openModal = (type) => {
        setFormData({ ...formData, type: type, category: type === 'Credit' ? creditCategoriesArray[0] : debitCategoriesArray[0] });
        setShowModal(true);
    };

    return (
        <div className="transactions">
            <div className="header">
                <Navbar title="Transactions" handleLogout={handleLogout} />
            </div>
            <div className="transactions-section">
                {error && <p className="error m-5">{error}</p>}
                <div className="d-flex justify-content-between align-items-center my-3">
                    <Button onClick={() => handleMonthChange("prev")}>&lt;</Button>
                    <h4>{currentMonth.format("MMMM YYYY")}</h4>
                    <Button onClick={() => handleMonthChange("next")}>&gt;</Button>
                </div>

                {/* Display number of transactions and balance amount */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <strong>Number of Transactions:</strong> {transactions.length}
                    </div>
                    <div>
                        <strong>Balance Amount:</strong> ${calculateBalance().toFixed(2)}
                    </div>
                </div>

                {/* Filters */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Dropdown
                        as={ButtonGroup}
                        onSelect={(e) => setTransactionType(e || "All")}
                    >
                        <Dropdown.Toggle variant="secondary">
                            {transactionType}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="All">All</Dropdown.Item>
                            <Dropdown.Item eventKey="Credit">Credit</Dropdown.Item>
                            <Dropdown.Item eventKey="Debit">Debit</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown
                        as={ButtonGroup}
                        onSelect={(e) => setSelectedCategory(e || "All")}
                    >
                        <Dropdown.Toggle variant="secondary">
                            {selectedCategory}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="All">All</Dropdown.Item>
                            {/* Add your categories here */}
                            <Dropdown.Item eventKey="Salary">Salary</Dropdown.Item>
                            <Dropdown.Item eventKey="Side Jobs">Side Jobs</Dropdown.Item>
                            <Dropdown.Item eventKey="Pension">Pension</Dropdown.Item>
                            <Dropdown.Item eventKey="Other (Income)">Other (Income)</Dropdown.Item>
                            <Dropdown.Item eventKey="Eating Out">Eating Out</Dropdown.Item>
                            <Dropdown.Item eventKey="Shopping">Shopping</Dropdown.Item>
                            <Dropdown.Item eventKey="Transportation">Transportation</Dropdown.Item>
                            <Dropdown.Item eventKey="Entertainment">Entertainment</Dropdown.Item>
                            <Dropdown.Item eventKey="Rent">Rent</Dropdown.Item>
                            <Dropdown.Item eventKey="Utility">Utility</Dropdown.Item>
                            <Dropdown.Item eventKey="Other (Home)">Other (Home)</Dropdown.Item>
                            <Dropdown.Item eventKey="Family">Family</Dropdown.Item>
                            <Dropdown.Item eventKey="Health/Sport">Health/Sport</Dropdown.Item>
                            <Dropdown.Item eventKey="Pets">Pets</Dropdown.Item>
                            <Dropdown.Item eventKey="Travel">Travel</Dropdown.Item>
                            <Dropdown.Item eventKey="Other (Expenses)">Other (Expenses)</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>

                { }

                {/* Transactions Table */}
                <table className="table table-striped mt-4">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.length > 0 ? (
                            transactions.map((transaction) => (
                                <tr key={transaction._id}>
                                    <td>{new Date(transaction.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</td>
                                    <td>{transaction.category}</td>
                                    <td>{transaction.description}</td>
                                    <td>${transaction.amount}</td>
                                    <td className={transaction.type === 'Credit' ? "text-success" : "text-danger"}>{transaction.type}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No transactions found for this period.</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Add Transaction Modals */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add New {formData.type} Transaction</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleFormSubmit}>
                            <Form.Group controlId="formDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formCategory">
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {formData.type === 'Credit'
                                        ? creditCategoriesArray.map((val, index) => (
                                            <option key={index} value={val}>{val}</option>
                                        ))
                                        : debitCategoriesArray.map(val => (
                                            <option key={val} value={val}>{val}</option>
                                        ))
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formAmount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Add Transaction
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Floating Action Buttons for Adding Transactions */}
                <div className="fab-container">
                    <Button
                        variant="success"
                        className="fab"
                        onClick={() => openModal("Credit")}
                    >
                        <strong>+</strong>
                    </Button>
                    <Button
                        variant="danger"
                        className="fab"
                        onClick={() => openModal("Debit")}
                    >
                        <strong>-</strong>
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default Transactions;

