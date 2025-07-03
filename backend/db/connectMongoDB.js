import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectMongoDB = async() => {
    try {
        console.log('Attempting to connect to MongoDB...');

        // Use local MongoDB instance if MONGO_URI is not provided
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/afet-arac-talep';
        console.log('Using MongoDB URI:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@')); // Log URI without credentials

        // Configure mongoose
        mongoose.set('strictQuery', true);

        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB connected successfully to: ${conn.connection.host}`);

        // Test the connection with a simple query
        await mongoose.connection.db.admin().ping();
        console.log('MongoDB connection is healthy (ping successful)');

    } catch (error) {
        console.error('MongoDB connection error details:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.name === 'MongoServerSelectionError') {
            console.error('Could not connect to MongoDB server. Please make sure MongoDB is running.');
        }
        throw error;
    }
}

export default connectMongoDB;