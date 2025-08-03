import { BienTheController } from "../controllers/BienTheController";
import { Router } from "express";

const router = Router();
router.get("/:mauSacId/:kichCoId/:sanPhamId", BienTheController.checkExist);
router.put('/:id', BienTheController.updateSoLuong);
router.get('/:id', BienTheController.getById);
router.get('/san-pham/:sanPhamId', BienTheController.getByProductId);
router.delete('/:id', BienTheController.deleteBienThe);
router.post('/', BienTheController.createVariant);
router.patch('/:id/soft-delete', BienTheController.deleteBienTheAo);

export default router;