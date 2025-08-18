import { Router } from 'express';
import { NguoiDungController } from '../controllers/NguoiDungController';
import { authMiddleware, AuthRequest } from "../middlewares/auth";

const router: Router = Router();

// Public route (không cần login)
router.post('/login', NguoiDungController.login);
router.post('/forgot-password/send-otp', NguoiDungController.sendOTP);
router.post('/forgot-password/verify-otp', NguoiDungController.verifyOTP);
router.post('/forgot-password/reset-password', NguoiDungController.resetPassword);
router.post('/create', NguoiDungController.create);

// Protected routes (cần token hợp lệ mới gọi được)
router.get('/', authMiddleware, NguoiDungController.getAll);
router.get('/count', authMiddleware, NguoiDungController.countNguoiDung);
router.put('/update', authMiddleware, NguoiDungController.update);
router.delete('/:id', authMiddleware, NguoiDungController.delete);
router.get("/me", authMiddleware, (req: AuthRequest, res) => {
    res.json({ user: req.user }); // trả lại thông tin user decode từ token
});

export default router;
