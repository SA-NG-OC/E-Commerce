// routes/giaoDichThanhToanRoutes.ts
import express from 'express';
import { GiaoDichThanhToanController } from '../controllers/GiaoDichThanhToanController';

const router = express.Router();

router.post('/', GiaoDichThanhToanController.create);

export default router;
