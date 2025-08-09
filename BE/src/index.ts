import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/san-pham', require('./routes/sanPhamRoutes').default);
app.use('/api', require('./routes/danhGiaSPRoutes').default);
app.use('/api/nguoi-dung', require('./routes/nguoiDungRoutes').default);
app.use('/api/gio-hang', require('./routes/gioHangRoutes').default);
app.use('/api/don-hang', require('./routes/donHangRoutes').default);
app.use('/api/danh-muc', require('./routes/danhMucRoutes').default);
app.use('/api/thuong-hieu', require('./routes/thuongHieuRoutes').default);
app.use('/api/mau-sac', require('./routes/mauSacRoutes').default);
app.use('/api/kich-co', require('./routes/kichCoRoutes').default);
app.use('/api/bien-the', require('./routes/bienTheRoutes').default);
app.use('/api/thanh-toan', require('./routes/thanhToanSPRoutes').default);
app.use('/api/giao-dich', require('./routes/giaoDichThanhToanRoutes').default);
app.use('/api/dia-chi', require('./routes/diaChiGiaoHangRoutes').default);
app.use('/api/hinh-anh-sp', require('./routes/hinhAnhSPRoutes').default);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;