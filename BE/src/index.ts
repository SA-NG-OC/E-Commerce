import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sanPhamRoutes from './routes/sanPhamRoutes';
import danhGiaSPRoutes from './routes/danhGiaSPRoutes';
import nguoiDungRoutes from './routes/nguoiDungRoutes';
import gioHangRoutes from './routes/gioHangRoutes';
import donHangRoutes from './routes/donHangRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/san-pham', sanPhamRoutes); //Sử dụng api từ sanPhamRoutes cho /api/san-pham
app.use('/api', danhGiaSPRoutes);
app.use('/api', nguoiDungRoutes);
app.use('/api/gio-hang', gioHangRoutes);
app.use('/api/don-hang', donHangRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;