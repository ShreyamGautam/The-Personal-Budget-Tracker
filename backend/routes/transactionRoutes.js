const express = require('express');
const auth = require('../middleware/auth');
const { 
    getTransactions, 
    addTransaction, 
    deleteTransaction, 
    updateTransaction,
    getDashboardSummary,
    getThirtyDayExpenses,
    getSixtyDayIncome,
    getThirtyDayIncome 
} = require('../controllers/transactionController');
const router = express.Router();

// Add 'auth' middleware to every route to protect it
router.post('/add-transaction', auth, addTransaction);
router.get('/get-transactions', auth, getTransactions);
router.put('/update-transaction/:id', auth, updateTransaction);
router.delete('/delete-transaction/:id', auth, deleteTransaction);
router.get('/dashboard-summary', auth, getDashboardSummary);
router.get('/thirty-day-expenses', auth, getThirtyDayExpenses);
router.get('/sixty-day-income', auth, getSixtyDayIncome);
router.get('/thirty-day-income', auth, getThirtyDayIncome);

module.exports = router;