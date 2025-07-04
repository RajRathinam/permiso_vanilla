import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const dbConnect = async () => {
    if (!MONGO_URI) {
        console.error('MONGO_URI not found in environment variables');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI); // No options needed
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error(`DB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default dbConnect;