const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const groupExpenseRoutes = require('./routes/groupExpenseRoutes'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/v1', transactionRoutes); 
app.use('/api/v1', budgetRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', groupRoutes);
// Nested route for group expenses
app.use('/api/v1/groups/:groupId/expenses', groupExpenseRoutes); 

// DB Connection Function
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Database Connected! Jhakass!');
    } catch (error) {
        console.error('DB Connection Error:', error);
    }
};

const server = () => {
    connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

server();