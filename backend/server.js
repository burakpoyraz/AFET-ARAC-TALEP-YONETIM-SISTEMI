import express from 'express';
import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './db/connectMongoDB.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;


const app = express();

app.use("/api/auth",authRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectMongoDB();
});