import { Router } from 'express';
import { DanhGiaSPController } from '../controllers/DanhGiaSPController';

const router: Router = Router();

// Lấy tất cả đánh giá của 1 sản phẩm
router.get('/san-pham/:san_pham_id/danh-gia', DanhGiaSPController.getBySanPhamId);
router.post('/san-pham/:san_pham_id/danh-gia', DanhGiaSPController.create);
router.put('/danh-gia/:id', DanhGiaSPController.update);
router.delete('/danh-gia/:id', DanhGiaSPController.delete);

export default router;
