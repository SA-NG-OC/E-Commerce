import { Router } from 'express';
import { GioHangController } from '../controllers/GioHangController';
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Lấy giỏ hàng theo người dùng
router.get('/:nguoi_dung_id', GioHangController.getGioHang);

// Tạo giỏ hàng mới
router.post('/create/:nguoi_dung_id', GioHangController.createGioHang);

// Thêm sản phẩm vào giỏ hàng
router.post('/them', authMiddleware(["Khách hàng"]), GioHangController.themSanPhamVaoGioHang);

// Xóa sản phẩm theo biến thể khỏi giỏ hàng
router.delete('/:gio_hang_id/bien-the/:bien_the_id', authMiddleware(["Khách hàng"]), GioHangController.xoaSanPham);

// Cập nhật số lượng sản phẩm theo biến thể
router.put('/:gio_hang_id/bien-the/:bien_the_id', authMiddleware(["Khách hàng"]), GioHangController.capNhatSoLuong);

export default router;
