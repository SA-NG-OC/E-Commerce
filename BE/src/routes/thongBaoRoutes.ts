// routes/thongBaoRoutes.ts
import { Router } from 'express';
import { ThongBaoController } from '../controllers/ThongBaoController';
import { Server } from 'socket.io';
import { authMiddleware } from "../middlewares/auth";

// Factory function để tạo routes với Socket.IO instance
export function createThongBaoRoutes(io: Server): Router {
    const router = Router();
    const thongBaoController = new ThongBaoController(io);

    // POST /api/thong-bao - Gửi thông báo mới
    router.post('/', thongBaoController.guiThongBao);

    // GET /api/thong-bao/:nguoi_dung_id - Lấy danh sách thông báo của người dùng
    router.get('/:nguoi_dung_id', thongBaoController.layThongBaoNguoiDung);

    router.post('/mark-all-read/:nguoi_dung_id', thongBaoController.markAllAsRead);
    // API đánh dấu đã đọc 1 thông báo
    router.post('/:thong_bao_id/mark-read', thongBaoController.markAsRead);

    // API xóa thông báo
    router.delete('/:thong_bao_id', thongBaoController.deleteThongBao);

    return router;
}