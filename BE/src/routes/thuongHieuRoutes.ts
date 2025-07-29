import { Router } from 'express';
import { ThuongHieuController } from '../controllers/ThuongHieuController';

const router = Router();

// Lấy tất cả thương hiệu kèm sản phẩm (và ảnh đại diện)
router.get('/', ThuongHieuController.getAll);

export default router;
