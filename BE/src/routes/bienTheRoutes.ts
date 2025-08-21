import { BienTheController } from "../controllers/BienTheController";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
router.get("/:mauSacId/:kichCoId/:sanPhamId", BienTheController.checkExist);
router.put('/:id', BienTheController.updateSoLuong);
router.get('/:id', BienTheController.getById);
router.get('/san-pham/:sanPhamId', BienTheController.getByProductId);
router.delete('/:id', BienTheController.deleteBienThe);
router.post('/', authMiddleware(["Quản trị viên", "Nhân viên"]), BienTheController.createVariant);
router.patch('/:id/soft-delete', authMiddleware(["Quản trị viên", "Nhân viên"]), BienTheController.deleteBienTheAo);

export default router;