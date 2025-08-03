import { Request, Response } from 'express';
import { ThuongHieuService } from '../services/ThuongHieuService';

export class ThuongHieuController {
    // GET http://localhost:3000/api/thuong-hieu
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const thuongHieus = await ThuongHieuService.getAll();
            res.status(200).json(thuongHieus);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }
}
