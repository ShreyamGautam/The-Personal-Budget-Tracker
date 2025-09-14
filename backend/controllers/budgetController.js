const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// SET BUDGET (USER-AWARE)
exports.setBudget = async (req, res) => {
    const { category, limit } = req.body;
    try {
        const budget = await Budget.findOneAndUpdate(
            { category, user: req.user.id }, // Find by category AND user
            { category, limit, user: req.user.id },
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json({ message: 'Budget Set Successfully', budget });
    } catch (error) {
        console.error("Error setting budget:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET BUDGETS (USER-AWARE)
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id }).lean();
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        for (const budget of budgets) {
            const spending = await Transaction.aggregate([
                {
                    $match: {
                        user: userId,
                        category: budget.category,
                        type: 'expense',
                        date: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);
            budget.spent = spending.length > 0 ? spending[0].total : 0;
        }
        res.status(200).json(budgets);
    } catch (error) {
        console.error("Error getting budgets:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// DELETE BUDGET (USER-AWARE)
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });
        res.status(200).json({ message: 'Budget Deleted Successfully' });
    } catch (error) {
        console.error("Error deleting budget:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};