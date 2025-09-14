const express = require('express');
const auth = require('../middleware/auth'); // Import the auth middleware
const { setBudget, getBudgets, deleteBudget } = require('../controllers/budgetController');
const router = express.Router();

// Add 'auth' to each route to protect it
router.post('/set-budget', auth, setBudget);
router.get('/get-budgets', auth, getBudgets);
router.delete('/delete-budget/:id', auth, deleteBudget);

module.exports = router;