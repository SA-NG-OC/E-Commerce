import { Router } from 'express';
import { HinhAnhSPController } from '../controllers/HinhAnhSPController';
import { authMiddleware } from "../middlewares/auth";

const router = Router();

// GET /api/hinh-anh-sp/san-pham/:productId - Lấy ảnh theo sản phẩm
router.get('/san-pham/:productId', HinhAnhSPController.getByProductId);

// POST /api/hinh-anh-sp/upload - Upload ảnh
router.post('/upload', authMiddleware(["Quản trị viên", "Nhân viên"]), HinhAnhSPController.uploadImages);

// DELETE /api/hinh-anh-sp/:id - Xóa ảnh
router.delete('/', authMiddleware(["Quản trị viên", "Nhân viên"]), HinhAnhSPController.delete);

export default router;