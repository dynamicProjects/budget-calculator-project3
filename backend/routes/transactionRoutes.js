const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction } = require('../controllers/transactionController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

router.get('/', ensureAuthenticated, getTransactions);
router.post('/', ensureAuthenticated, addTransaction);

module.exports = router;