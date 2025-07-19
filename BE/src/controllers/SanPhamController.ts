import { Request, Response } from 'express';
import { SanPhamService } from '../services/SanPhamService';
import { SanPham } from '../models/SanPhamModel';

export class SanPhamController {
    static async getById(req: Request, res: Response) {
        try {
            const sanPham = await SanPhamService.getById(req.params.id);
            if (!sanPham) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            res.json(sanPham);
        } catch (err) {
            console.error('Lỗi khi lấy sản phẩm:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
    static async getAllWithImages(req: Request, res: Response) {
        try {
            const danhSach = await SanPhamService.getAllWithImages();
            res.json(danhSach);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', err);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    /*static async create(req: Request, res: Response) {
        try {
            const sp = new SanPham(req.body);
            const created = await SanPhamService.create(sp);
            res.status(201).json(created);
        } catch (err) {
            console.error('Lỗi khi thêm sản phẩm:', err);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }*/
}
