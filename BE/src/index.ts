import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { setSocketInstance } from './services/ThongBaoService';
import { createDonHangRoutes } from './routes/donHangRoutes';
import { createThongBaoRoutes } from './routes/thongBaoRoutes';


dotenv.config();
const app = express();
const server = http.createServer(app); // Tạo HTTP server để Socket.IO hook vào
const io = new Server(server, {
    cors: {
        origin: "*", // Cho phép tất cả domain kết nối
        methods: ["GET", "POST"]
    }
});
const PORT = process.env.PORT || 3000;

// Truyền io vào ThongBaoService để khi gọi guiThongBao có thể emit realtime
setSocketInstance(io);


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/san-pham', require('./routes/sanPhamRoutes').default);
app.use('/api', require('./routes/danhGiaSPRoutes').default);
app.use('/api/nguoi-dung', require('./routes/nguoiDungRoutes').default);
app.use('/api/gio-hang', require('./routes/gioHangRoutes').default);
app.use('/api/don-hang', createDonHangRoutes(io));
app.use('/api/danh-muc', require('./routes/danhMucRoutes').default);
app.use('/api/thuong-hieu', require('./routes/thuongHieuRoutes').default);
app.use('/api/mau-sac', require('./routes/mauSacRoutes').default);
app.use('/api/kich-co', require('./routes/kichCoRoutes').default);
app.use('/api/bien-the', require('./routes/bienTheRoutes').default);
app.use('/api/thanh-toan', require('./routes/thanhToanSPRoutes').default);
app.use('/api/giao-dich', require('./routes/giaoDichThanhToanRoutes').default);
app.use('/api/dia-chi', require('./routes/diaChiGiaoHangRoutes').default);
app.use('/api/hinh-anh-sp', require('./routes/hinhAnhSPRoutes').default);
app.use('/api/thong-bao', createThongBaoRoutes(io))

// Lắng nghe kết nối socket
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;