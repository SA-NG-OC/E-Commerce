import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/san-pham', require('./routes/sanPhamRoutes').default);
app.use('/api', require('./routes/danhGiaSPRoutes').default);
app.use('/api', require('./routes/nguoiDungRoutes').default);
app.use('/api/gio-hang', require('./routes/gioHangRoutes').default);
app.use('/api/don-hang', require('./routes/donHangRoutes').default);
app.use('/api/danh-muc', require('./routes/danhMucRoutes').default);
app.use('/api/thuong-hieu', require('./routes/thuongHieuRoutes').default);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;