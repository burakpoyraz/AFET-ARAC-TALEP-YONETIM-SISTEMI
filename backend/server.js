import express from 'express';
import authRoutes from './routes/auth.route.js';
import kullaniciRoutes from './routes/kullanici.route.js';
import kurumFirmaRoutes from './routes/kurumFirma.route.js';
import aracRoutes from './routes/arac.route.js';
import talepRoutes from './routes/talep.route.js';
import connectMongoDB from './db/connectMongoDB.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json()); // req.body'yi kullanabilmek için
app.use(express.urlencoded({ extended: true })); // Formdan gelen verileri kullanabilmek için

app.use(cookieParser()); // Cookie'leri kullanabilmek için

app.use("/api/auth",authRoutes);
app.use("/api/kullanicilar",kullaniciRoutes);
app.use("/api/kurumlar",kurumFirmaRoutes);
app.use("/api/araclar",aracRoutes);
app.use("/api/talepler",talepRoutes);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectMongoDB();
});