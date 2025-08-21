// routes/diaChiGiaoHangRoutes.ts
import { Router } from 'express';
import { DiaChiGiaoHangController } from '../controllers/DiaChiGiaoHangController';
import { authMiddleware } from "../middlewares/auth";

const router = Router();

router.post('/', DiaChiGiaoHangController.create);
router.get('/:donHangId', DiaChiGiaoHangController.getByDonHangId);
router.put('/cap-nhat/:addressId', DiaChiGiaoHangController.update);

export default router;
