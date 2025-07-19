import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sanPhamRoutes from './routes/sanPhamRoutes';
import danhGiaSPRoutes from './routes/danhGiaSPRoutes';
import nguoiDungRoutes from './routes/nguoiDungRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/san-pham', sanPhamRoutes);
app.use('/api', danhGiaSPRoutes);
app.use('/api', nguoiDungRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;