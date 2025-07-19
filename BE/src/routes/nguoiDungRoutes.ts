import { Router } from 'express';
import { NguoiDungController } from '../controllers/NguoiDungController';

const router = Router();

router.post('/nguoi-dung/login', NguoiDungController.login);

export default router;
