import { BienTheController } from "../controllers/BienTheController";
import { Router } from "express";

const router = Router();
router.get("/:mauSacId/:kichCoId/:sanPhamId", BienTheController.checkExist);
export default router;