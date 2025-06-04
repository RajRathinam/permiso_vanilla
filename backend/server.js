import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import complaintsRoutes from './routes/complaints.js';
import leaves from './routes/leaves.js';
import onduty from './routes/onduty.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true // Allow cookies if needed
}));
app.use(express.json()); // Middleware to parse JSON
app.use(express.static('public'));


// Routes
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintsRoutes);
app.use('/api/leave', leaves);
app.use('/api/onduty', onduty);

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Connect to MongoDB
    dbConnect();
});
