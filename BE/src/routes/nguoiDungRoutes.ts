import { Router } from 'express';
import { NguoiDungController } from '../controllers/NguoiDungController';
import { authMiddleware, AuthRequest } from "../middlewares/auth";

const router: Router = Router();

// Public route (không cần login)
router.post('/login', NguoiDungController.login);
router.post('/forgot-password/send-otp', NguoiDungController.sendOTP);
router.post('/forgot-password/verify-otp', NguoiDungController.verifyOTP);
router.post('/forgot-password/reset-password', NguoiDungController.resetPassword);
router.post('/create', authMiddleware(["Quản trị viên"]), NguoiDungController.create);

// Protected routes (cần token hợp lệ mới gọi được)
// Chỉ ADMIN, STAFF được xem danh sách user
// ADMIN ("Quản trị viên"), STAFF ("Nhân viên") được phép xem
router.get("/", authMiddleware(["Quản trị viên", "Nhân viên"]), NguoiDungController.getAll);

// ADMIN, STAFF được xem số lượng user
router.get("/count", authMiddleware(["Quản trị viên", "Nhân viên"]), NguoiDungController.countNguoiDung);

// ADMIN, STAFF được update
router.put("/update", authMiddleware(["Quản trị viên", "Nhân viên"]), NguoiDungController.update);

// Chỉ ADMIN ("Quản trị viên") được xóa
router.delete("/:id", authMiddleware(["Quản trị viên"]), NguoiDungController.delete);

router.get("/me", authMiddleware(), (req: AuthRequest, res) => {
    res.json({ user: req.user });
});


export default router;
