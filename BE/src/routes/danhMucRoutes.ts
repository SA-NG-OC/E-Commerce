import { Router } from 'express';
import { DanhMucController } from '../controllers/DanhMucController';
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// Lấy tất cả danh mục (kèm sản phẩm và ảnh đại diện)
router.get('/', DanhMucController.getAll);
router.put('/:id', authMiddleware(["Quản trị viên", "Nhân viên"]), DanhMucController.update);
router.post('/', authMiddleware(["Quản trị viên", "Nhân viên"]), DanhMucController.create);
router.delete('/:id', authMiddleware(["Quản trị viên", "Nhân viên"]), DanhMucController.delete);
export default router;
