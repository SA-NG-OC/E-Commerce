import { Router } from 'express';
import { DonHangController } from '../controllers/DonHangController';

const router = Router();

// Lấy giỏ hàng theo người dùng
router.get('/:nguoi_dung_id', DonHangController.getByNguoiDungId);
router.get('/', DonHangController.getAllDonHang);
router.patch('/:don_hang_id/:nguoi_dung_id', DonHangController.huyDonHang);
router.post('/tao', DonHangController.createDonHang);
router.post('/chi-tiet/them', DonHangController.addChiTietDonHang);
router.delete('/:id', DonHangController.deleteDonHang);
router.put('/cap-nhat-trang-thai/:id', DonHangController.capNhatTrangThaiDonHang);
export default router;