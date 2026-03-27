import express from 'express';
import helmet from 'helmet';
import { xss } from 'express-xss-sanitizer';
import 'dotenv/config';
import bookRoutes from './routes/bookRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API Sistem Manajemen Perpustakaan berjalan',
        version: '1.0.0',
        endpoints: {
        books: '/books',
        },
    });
});

app.use('/books', bookRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} tidak ditemukan`,
    });
});

app.use((err, req, res, next) => {
    console.error('Global error:', err.message);
    res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: err.message,
    });
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});