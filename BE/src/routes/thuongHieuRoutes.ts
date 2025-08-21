import { Router } from 'express';
import { ThuongHieuController } from '../controllers/ThuongHieuController';
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Lấy tất cả thương hiệu kèm sản phẩm (và ảnh đại diện)
router.get('/', ThuongHieuController.getAll);
router.put('/:id', authMiddleware(["Quản trị viên", "Nhân viên"]), ThuongHieuController.updateName);
router.post('/', authMiddleware(["Quản trị viên", "Nhân viên"]), ThuongHieuController.create);
router.delete('/:id', authMiddleware(["Quản trị viên", "Nhân viên"]), ThuongHieuController.delete);

export default router;
