import { Router } from 'express';
import { GioHangController } from '../controllers/GioHangController';

const router = Router();


// Lấy giỏ hàng theo người dùng
router.get('/:nguoi_dung_id', GioHangController.getGioHang);

// Tạo giỏ hàng mới
router.post('/', GioHangController.createGioHang);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/:gio_hang_id/san-pham/:san_pham_id', GioHangController.xoaSanPham);

// Cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/:gio_hang_id/san-pham/:san_pham_id', GioHangController.capNhatSoLuong);

export default router;
