// routes/giaoDichThanhToanRoutes.ts
import express from 'express';
import { GiaoDichThanhToanController } from '../controllers/GiaoDichThanhToanController';

const router = express.Router();

router.post('/', GiaoDichThanhToanController.create);
router.get('/', GiaoDichThanhToanController.getAll);
router.get('/:donHangId', GiaoDichThanhToanController.getByDonHangId);
router.put('/cap-nhat-trang-thai/:paymentId', GiaoDichThanhToanController.updateStatus);

export default router;
