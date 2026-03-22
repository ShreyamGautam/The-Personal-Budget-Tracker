const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
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
app.use('/api/v1/groups/:groupId/expenses', groupExpenseRoutes); 

// DB Connection Function
const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB Atlas...');
        await mongoose.connect(process.env.MONGO_URL, {
            serverSelectionTimeoutMS: 5000 // 5 seconds timeout
        });
        console.log('Database Connected! Jhakass!');
    } catch (error) {
        console.warn('Atlas connection failed. Falling back to In-Memory Database...');
        try {
            const mongoServer = await MongoMemoryServer.create();
            const mongoUri = mongoServer.getUri();
            await mongoose.connect(mongoUri);
            console.log('Connected to In-Memory MongoDB! (Data will not be persisted)');
        } catch (innerError) {
            console.error('Fatal: Could not start In-Memory MongoDB:', innerError);
            process.exit(1);
        }
    }
};

const server = () => {
    connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
};

server();