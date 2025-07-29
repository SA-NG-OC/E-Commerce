import { Request, Response } from 'express';
import { DanhMucService } from '../services/DanhMucService';

export class DanhMucController {
    // GET /api/danh-muc
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const danhMucs = await DanhMucService.getAll();
            res.status(200).json(danhMucs);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }
}
