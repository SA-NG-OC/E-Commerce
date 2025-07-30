import { Request, Response } from "express";
import { MauSacService } from "../services/MauSacService";
import { MauSacModel } from "../models/MauSacModel";

//Sử dụng api http://localhost:3000/api/mau-sac/
export class MauSacController {
    static async getAll(req: Request, res: Response) {
        try {
            const mauSacs: MauSacModel[] | null = await MauSacService.getAll();
            res.json(mauSacs);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách màu sắc:', err);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
    static async getColorsBySanPhamId(req: Request, res: Response) {
        const sanPhamId = req.params.sanPhamId;
        try {
            const mauSacs: MauSacModel[] | null = await MauSacService.getColorsBySanPhamId(sanPhamId);
            if (mauSacs) {
                res.json(mauSacs);
            } else {
                res.status(404).json({ message: 'Không tìm thấy màu sắc cho sản phẩm này' });
            }
        } catch (err) {
            console.error('Lỗi khi lấy màu sắc cho sản phẩm:', err);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }
}
