import { Router } from 'express';
import { NguoiDungController } from '../controllers/NguoiDungController';

const router: Router = Router();

router.post('/login', NguoiDungController.login);
router.get('/', NguoiDungController.getAll);
router.get('/count', NguoiDungController.countNguoiDung);
router.put('/update', NguoiDungController.update);
router.post('/create', NguoiDungController.create);
router.delete('/:id', NguoiDungController.delete);
export default router;
