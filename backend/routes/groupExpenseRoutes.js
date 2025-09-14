const express = require('express');
const auth = require('../middleware/auth'); // Make sure the path to your auth middleware is correct

// Import all necessary functions from your controller
const { 
    addGroupExpense, 
    getGroupExpenses,
    updateGroupExpense,
    deleteGroupExpense
} = require('../controllers/groupExpenseController'); // Make sure the path to your controller is correct

// Initialize router with mergeParams to access :groupId from the parent route
const router = express.Router({ mergeParams: true });

// This route handles adding a new expense and getting all expenses for the group.
// Full URL: POST /api/v1/groups/:groupId/expenses
// Full URL: GET  /api/v1/groups/:groupId/expenses
router.route('/')
    .post(auth, addGroupExpense)
    .get(auth, getGroupExpenses);

// This route handles updating or deleting a specific expense by its ID.
// Full URL: PUT    /api/v1/groups/:groupId/expenses/:expenseId
// Full URL: DELETE /api/v1/groups/:groupId/expenses/:expenseId
router.route('/:expenseId')
    .put(auth, updateGroupExpense)
    .delete(auth, deleteGroupExpense);

module.exports = router;