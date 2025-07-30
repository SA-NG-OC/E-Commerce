import { KichCoModel } from "../models/KichCoModel";
import { KichCoService } from "../services/KichCoService";
import { Request, Response } from 'express';

// Sử dụng api http://localhost:3000/api/kich-co/
export class KichCoController {
    static async getAll(req: Request, res: Response) {
        try {
            const kichCos: KichCoModel[] | null = await KichCoService.getAll();
            res.json(kichCos);
        }
        catch (err) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
    static async getSizesBySanPhamId(req: Request, res: Response) {
        const sanPhamId = req.params.sanPhamId;
        try {
            const kichCos: KichCoModel[] | null = await KichCoService.getSizesBySanPhamId(sanPhamId);
            if (kichCos) {
                res.json(kichCos);
            } else {
                res.status(404).json({ message: 'Không tìm thấy kích cỡ cho sản phẩm này' });
            }
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
}
