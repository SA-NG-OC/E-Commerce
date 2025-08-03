import { Router } from 'express';
import { DonHangController } from '../controllers/DonHangController';

const router = Router();

// Lấy giỏ hàng theo người dùng
router.get('/:nguoi_dung_id', DonHangController.getByNguoiDungId);
router.patch('/:don_hang_id/:nguoi_dung_id', DonHangController.huyDonHang);
router.post('/tao', DonHangController.createDonHang);
router.post('/chi-tiet/them', DonHangController.addChiTietDonHang);
router.delete('/:id', DonHangController.deleteDonHang);
export default router;