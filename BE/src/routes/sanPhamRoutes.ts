import express, { Router } from 'express';
import { SanPhamController } from '../controllers/SanPhamController';
import { authMiddleware } from "../middlewares/auth";

const router: Router = express.Router();

router.get('/filter/:danhMucId/all', SanPhamController.getByDanhMuc);
router.get('/filter/all/:thuongHieuId', SanPhamController.getByThuongHieu);
// 1. Routes tĩnh (static) - ưu tiên cao nhất
router.get('/id', SanPhamController.getIdSanPham);
router.get('/count', authMiddleware(["Quản trị viên", "Nhân viên"]), SanPhamController.countSanPham);

// 2. Routes có action cụ thể  
router.put('/update-danh-muc', authMiddleware(["Quản trị viên", "Nhân viên"]), SanPhamController.updateDanhMucSanPham);
router.put('/update-thuong-hieu', authMiddleware(["Quản trị viên", "Nhân viên"]), SanPhamController.updateThuongHieuSanPham);

// 3. Routes có nhiều tham số
router.get('/filter/:danhMucId/:thuongHieuId', SanPhamController.getByDanhMuc_ThuongHieu);

// 4. Routes có 1 tham số + action

router.patch('/:id/soft-delete', authMiddleware(["Quản trị viên", "Nhân viên"]), SanPhamController.deleteSanPhamAo);

// 5. Routes CRUD cơ bản với tham số - ưu tiên thấp
router.get('/:id', SanPhamController.getById);
router.put('/:id', authMiddleware(["Quản trị viên", "Nhân viên"]), SanPhamController.updateSanPham);

// 6. Routes catch-all - để cuối cùng
router.get('/', SanPhamController.getAllWithImages);
router.post('/', authMiddleware(["Quản trị viên", "Nhân viên"]), SanPhamController.createSanPham);
export default router;
