import { Router } from 'express';
import { DonHangController } from '../controllers/DonHangController';
import { Server } from 'socket.io';
import { authMiddleware } from "../middlewares/auth";

export function createDonHangRoutes(io: Server): Router {
    const router = Router();
    const donHangController = new DonHangController(io);

    router.get('/', authMiddleware(["Quản trị viên", "Nhân viên"]), donHangController.getAllDonHang);
    router.get('/count', authMiddleware(["Quản trị viên", "Nhân viên"]), donHangController.countDonHang);
    router.post('/tao', authMiddleware(["Khách hàng"]), donHangController.createDonHang);
    router.post('/chi-tiet/them', authMiddleware(["Khách hàng"]), donHangController.addChiTietDonHang);
    router.put('/cap-nhat-trang-thai/:id', donHangController.capNhatTrangThai);
    router.get('/:nguoi_dung_id', donHangController.getByNguoiDungId);
    router.patch('/:don_hang_id/:nguoi_dung_id', donHangController.huyDonHang);
    router.delete('/:id', authMiddleware(["Quản trị viên", "Nhân viên"]), donHangController.xoaDonHang);
    return router;
}