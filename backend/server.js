import express from 'express';
import authRoutes from './routes/auth.route.js';
import kullaniciRoutes from './routes/kullanici.route.js';
import kurumFirmaRoutes from './routes/kurumFirma.route.js';
import aracRoutes from './routes/arac.route.js';
import talepRoutes from './routes/talep.route.js';
import gorevRoutes from './routes/gorev.route.js';
import bildirimRoutes from './routes/bildirim.route.js';
import connectMongoDB from './db/connectMongoDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5001;
const FRONTEND_URLS = (process.env.FRONTEND_URLS || 'http://localhost:3002').split(',');

const app = express();

// Development CORS configuration
app.use(cors({
    origin: FRONTEND_URLS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json()); // req.body'yi kullanabilmek için
app.use(express.urlencoded({ extended: true })); // Formdan gelen verileri kullanabilmek için
app.use(cookieParser()); // Cookie'leri kullanabilmek için

// Add request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`, {
        body: req.body,
        query: req.query,
        params: req.params
    });
    next();
});

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/kullanicilar", kullaniciRoutes);
app.use("/api/kurumlar", kurumFirmaRoutes);
app.use("/api/araclar", aracRoutes);
app.use("/api/talepler", talepRoutes);
app.use("/api/gorevler", gorevRoutes);
app.use("/api/bildirimler", bildirimRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: err.code
    });

    // Send appropriate error response
    res.status(err.status || 500).json({
        error: "Sunucu hatası",
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { details: err.stack })
    });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: "Endpoint bulunamadı" });
});

const startServer = async() => {
    try {
        // Connect to MongoDB first
        await connectMongoDB();

        // Then start the server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log('Environment:', process.env.NODE_ENV || 'development');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();