import { Router } from 'express';
import { DonHangController } from '../controllers/DonHangController';
import { Server } from 'socket.io';

export function createDonHangRoutes(io: Server): Router {
    const router = Router();
    const donHangController = new DonHangController(io);

    router.get('/', donHangController.getAllDonHang);
    router.get('/count', donHangController.countDonHang);
    router.post('/tao', donHangController.createDonHang);
    router.post('/chi-tiet/them', donHangController.addChiTietDonHang);
    router.put('/cap-nhat-trang-thai/:id', donHangController.capNhatTrangThai);
    router.get('/:nguoi_dung_id', donHangController.getByNguoiDungId);
    router.patch('/:don_hang_id/:nguoi_dung_id', donHangController.huyDonHang);
    router.delete('/:id', donHangController.xoaDonHang);
    return router;
}