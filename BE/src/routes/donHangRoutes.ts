import { Router } from 'express';
import { DonHangController } from '../controllers/DonHangController';

const router = Router();

// Lấy giỏ hàng theo người dùng
router.get('/:nguoi_dung_id', DonHangController.getByNguoiDungId);
router.patch('/:don_hang_id/:nguoi_dung_id', DonHangController.huyDonHang);
export default router;