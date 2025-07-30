import { Router } from 'express';
import { MauSacController } from '../controllers/MauSacController';

const routes = Router();
routes.get('/', MauSacController.getAll);
routes.get('/:sanPhamId', MauSacController.getColorsBySanPhamId);
export default routes;


