import { Router } from 'express';
import { ThuongHieuController } from '../controllers/ThuongHieuController';

const router = Router();

// Lấy tất cả thương hiệu kèm sản phẩm (và ảnh đại diện)
router.get('/', ThuongHieuController.getAll);
router.put('/:id', ThuongHieuController.updateName);
router.post('/', ThuongHieuController.create);
router.delete('/:id', ThuongHieuController.delete);

export default router;
