import express, { Router } from 'express';
import { SanPhamController } from '../controllers/SanPhamController';

const router: Router = express.Router();

router.get('/', SanPhamController.getAllWithImages);
// Lấy sản phẩm theo id
router.get('/:id', SanPhamController.getById);
//router.post('/', SanPhamController.create);
// Đặt các route cụ thể trước
router.get('/filter/:danhMucId/all', SanPhamController.getByDanhMuc);
router.get('/filter/all/:thuongHieuId', SanPhamController.getByThuongHieu);
// Route tổng quát đặt cuối
router.get('/filter/:danhMucId/:thuongHieuId', SanPhamController.getByDanhMuc_ThuongHieu);
router.put('/:id', SanPhamController.updateSanPham);

export default router;
