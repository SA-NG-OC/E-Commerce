import express, { Router } from 'express';
import { SanPhamController } from '../controllers/SanPhamController';

const router: Router = express.Router();

router.get('/filter/:danhMucId/all', SanPhamController.getByDanhMuc);
router.get('/filter/all/:thuongHieuId', SanPhamController.getByThuongHieu);
// 1. Routes tĩnh (static) - ưu tiên cao nhất
router.get('/id', SanPhamController.getIdSanPham);
router.get('/count', SanPhamController.countSanPham);

// 2. Routes có action cụ thể  
router.put('/update-danh-muc', SanPhamController.updateDanhMucSanPham);
router.put('/update-thuong-hieu', SanPhamController.updateThuongHieuSanPham);

// 3. Routes có nhiều tham số
router.get('/filter/:danhMucId/:thuongHieuId', SanPhamController.getByDanhMuc_ThuongHieu);

// 4. Routes có 1 tham số + action

router.patch('/:id/soft-delete', SanPhamController.deleteSanPhamAo);

// 5. Routes CRUD cơ bản với tham số - ưu tiên thấp
router.get('/:id', SanPhamController.getById);
router.put('/:id', SanPhamController.updateSanPham);

// 6. Routes catch-all - để cuối cùng
router.get('/', SanPhamController.getAllWithImages);
router.post('/', SanPhamController.createSanPham);
export default router;
