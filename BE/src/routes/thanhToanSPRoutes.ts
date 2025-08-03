// routes/thanhToanRoutes.ts
import { Router } from 'express';
import { getThanhToanSPController } from '../controllers/ThanhToanSPController';

const router = Router();

// GET /thanh-toan/:bienTheId/:soLuong
router.get('/:bienTheId/:soLuong', getThanhToanSPController);

export default router;
