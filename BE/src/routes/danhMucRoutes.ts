import { Router } from 'express';
import { DanhMucController } from '../controllers/DanhMucController';

const router = Router();

// Lấy tất cả danh mục (kèm sản phẩm và ảnh đại diện)
router.get('/', DanhMucController.getAll);
router.put('/:id', DanhMucController.update);
router.post('/', DanhMucController.create);
router.delete('/:id', DanhMucController.delete);
export default router;
