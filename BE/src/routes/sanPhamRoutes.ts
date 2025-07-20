import express, { Router } from 'express';
import { SanPhamController } from '../controllers/SanPhamController';

const router: Router = express.Router();

router.get('/', SanPhamController.getAllWithImages);
// Lấy sản phẩm theo id
router.get('/:id', SanPhamController.getById);
//router.post('/', SanPhamController.create);

export default router;
