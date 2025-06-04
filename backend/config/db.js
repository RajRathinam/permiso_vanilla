import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const dbConnect = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.log(`DB Connection Error: ${error}`);
        process.exit(1);
    }
};

export default dbConnect;
