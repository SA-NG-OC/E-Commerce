import { Router } from 'express';
import { HinhAnhSPController } from '../controllers/HinhAnhSPController';

const router = Router();

// GET /api/hinh-anh-sp/san-pham/:productId - Lấy ảnh theo sản phẩm
router.get('/san-pham/:productId', HinhAnhSPController.getByProductId);

// POST /api/hinh-anh-sp/upload - Upload ảnh
router.post('/upload', HinhAnhSPController.uploadImages);

// DELETE /api/hinh-anh-sp/:id - Xóa ảnh
router.delete('/', HinhAnhSPController.delete);

export default router;