// routes/diaChiGiaoHangRoutes.ts
import { Router } from 'express';
import { DiaChiGiaoHangController } from '../controllers/DiaChiGiaoHangController';

const router = Router();

router.post('/', DiaChiGiaoHangController.create);

export default router;
