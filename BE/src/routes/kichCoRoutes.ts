import { Router } from "express";
import { KichCoController } from "../controllers/KichCoController";
import { authMiddleware } from "../middlewares/auth";

const router = Router();
router.get("/", KichCoController.getAll);
router.get("/:sanPhamId", KichCoController.getSizesBySanPhamId);
export default router;