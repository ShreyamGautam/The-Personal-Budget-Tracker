const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// --- Main CRUD Functions ---

/**
 * @desc    Add a new transaction
 * @route   POST /api/v1/add-transaction
 * @access  Private
 */
exports.addTransaction = async (req, res) => {
    const { title, amount, category, type, date, icon } = req.body;
    try {
        const newTransaction = new Transaction({
            user: req.user.id,
            title, amount, category, type, date, icon
        });
        const transaction = await newTransaction.save();
        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error adding transaction:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get all transactions for the logged-in user (with all filters)
 * @route   GET /api/v1/get-transactions
 * @access  Private
 */
exports.getTransactions = async (req, res) => {
    try {
        const { type, category, dateRange } = req.query;

        const filter = { user: req.user.id };

        // Add type filter (income or expense)
        if (type) {
            filter.type = type;
        }

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (dateRange) {
            const now = new Date();
            let startDate;
            if (dateRange === 'month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            } else if (dateRange === '6months') {
                startDate = new Date(new Date().setMonth(now.getMonth() - 6));
            }
            if (startDate) {
                filter.date = { $gte: startDate };
            }
        }
        
        const transactions = await Transaction.find(filter).sort({ date: -1 });
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error getting transactions:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Update a transaction
 * @route   PUT /api/v1/update-transaction/:id
 * @access  Private
 */
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json(transaction);
    } catch (error) {
        console.error("Error updating transaction:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/v1/delete-transaction/:id
 * @access  Private
 */
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json({ message: 'Transaction Deleted' });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// --- Dashboard & Page Summary Functions ---

/**
 * @desc    Get total income, expenses, and balance for the dashboard
 * @route   GET /api/v1/dashboard-summary
 * @access  Private
 */
exports.getDashboardSummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const totalIncome = await Transaction.aggregate([
            { $match: { user: userId, type: 'income' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalExpenses = await Transaction.aggregate([
            { $match: { user: userId, type: 'expense' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const income = totalIncome.length > 0 ? totalIncome[0].total : 0;
        const expenses = totalExpenses.length > 0 ? totalExpenses[0].total : 0;
        res.status(200).json({ totalIncome: income, totalExpenses: expenses, totalBalance: income - expenses });
    } catch (error) {
        console.error("Error getting dashboard summary:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get expenses grouped by day for the last 30 days
 * @route   GET /api/v1/thirty-day-expenses
 * @access  Private
 */
exports.getThirtyDayExpenses = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const expenses = await Transaction.aggregate([
            { $match: { user: userId, type: 'expense', date: { $gte: thirtyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, total: { $sum: '$amount' } } },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error getting 30-day expenses:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get income grouped by category for the last 60 days
 * @route   GET /api/v1/sixty-day-income
 * @access  Private
 */
exports.getSixtyDayIncome = async (req, res) => {
    try {
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const income = await Transaction.aggregate([
            { $match: { user: userId, type: 'income', date: { $gte: sixtyDaysAgo } } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } }
        ]);
        res.status(200).json(income);
    } catch (error) {
        console.error("Error getting 60-day income:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get income grouped by day for the last 30 days
 * @route   GET /api/v1/thirty-day-income
 * @access  Private
 */
exports.getThirtyDayIncome = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const income = await Transaction.aggregate([
            { $match: { user: userId, type: 'income', date: { $gte: thirtyDaysAgo } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, total: { $sum: '$amount' } } },
            { $sort: { _id: 1 } }
        ]);
        res.status(200).json(income);
    } catch (error) {
        console.error("Error getting 30-day income:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

