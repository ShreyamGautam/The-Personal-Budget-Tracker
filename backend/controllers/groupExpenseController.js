const GroupExpense = require('../models/GroupExpense');
const Group = require('../models/Group');

// @desc    Add a new expense to a group
// @route   POST /api/v1/groups/:groupId/expenses
exports.addGroupExpense = async (req, res) => {
    const { description, amount } = req.body;
    const { groupId } = req.params;
    const paidById = req.user.id;

    try {
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        const members = group.members;
        const splitAmount = amount / members.length;

        const splits = members.map(memberId => ({
            user: memberId,
            amount: splitAmount
        }));

        const newExpense = new GroupExpense({
            group: groupId,
            description,
            amount,
            paidBy: paidById,
            splits
        });

        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        console.error("Error adding group expense:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all expenses for a specific group
// @route   GET /api/v1/groups/:groupId/expenses
exports.getGroupExpenses = async (req, res) => {
    const { groupId } = req.params;
    try {
        const expenses = await GroupExpense.find({ group: groupId })
            .populate('paidBy', 'name')
            .populate('splits.user', 'name')
            .sort({ date: -1 });

        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching group expenses:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Update a specific expense
// @route   PUT /api/v1/groups/:groupId/expenses/:expenseId
exports.updateGroupExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        // Data from frontend form
        const { description, amount, paidBy } = req.body;

        // Find the expense by its ID and update it
        let expense = await GroupExpense.findById(expenseId);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Update the fields
        expense.description = description;
        expense.amount = amount;
        expense.paidBy = paidBy;
        // You can also add logic here to recalculate splits if needed

        await expense.save();
        
        // Populate paidBy field to send back the user's name
        expense = await expense.populate('paidBy', 'name');

        res.status(200).json(expense);

    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Delete a specific expense
// @route   DELETE /api/v1/groups/:groupId/expenses/:expenseId
exports.deleteGroupExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;

        const expense = await GroupExpense.findById(expenseId);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        await expense.deleteOne(); // This will delete the expense document

        res.status(200).json({ message: 'Expense deleted successfully' });

    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};