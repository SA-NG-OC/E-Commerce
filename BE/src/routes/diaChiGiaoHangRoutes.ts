// routes/diaChiGiaoHangRoutes.ts
import { Router } from 'express';
import { DiaChiGiaoHangController } from '../controllers/DiaChiGiaoHangController';

const router = Router();

router.post('/', DiaChiGiaoHangController.create);
router.get('/:donHangId', DiaChiGiaoHangController.getByDonHangId);
router.put('/cap-nhat/:addressId', DiaChiGiaoHangController.update);

export default router;
