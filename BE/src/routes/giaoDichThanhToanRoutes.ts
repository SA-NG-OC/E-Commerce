// routes/giaoDichThanhToanRoutes.ts
import express from 'express';
import { GiaoDichThanhToanController } from '../controllers/GiaoDichThanhToanController';
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.post('/', GiaoDichThanhToanController.create);
router.get('/', authMiddleware(["Quản trị viên", "Nhân viên"]), GiaoDichThanhToanController.getAll);
router.get('/:donHangId', GiaoDichThanhToanController.getByDonHangId);
router.put('/cap-nhat-trang-thai/:paymentId', authMiddleware(["Quản trị viên", "Nhân viên"]), GiaoDichThanhToanController.updateStatus);

export default router;
