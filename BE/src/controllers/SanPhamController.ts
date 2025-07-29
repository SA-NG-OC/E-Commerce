import { Request, Response } from 'express';
import { SanPhamService } from '../services/SanPhamService';
import { SanPham } from '../models/SanPhamModel';

export class SanPhamController {
    static async getById(req: Request, res: Response) {
        try {
            const sanPham: SanPham | null = await SanPhamService.getById(req.params.id);
            if (!sanPham) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            res.json(sanPham);
        } catch (err) {
            console.error('Lỗi khi lấy sản phẩm:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
    static async getAllWithImages(req: Request, res: Response) {
        try {
            const danhSach: SanPham[] = await SanPhamService.getAllWithImages();
            res.json(danhSach);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách sản phẩm:', err);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    static async getByDanhMuc_ThuongHieu(req: Request, res: Response) {
        try {
            const { danhMucId, thuongHieuId } = req.params; // 👈 đổi từ query sang params
            const sanPhams: SanPham[] = await SanPhamService.filterByDanhMucAndThuongHieu(danhMucId, thuongHieuId);
            res.json(sanPhams);
        } catch (err) {
            console.error('Lỗi khi lấy sản phẩm theo danh mục và thương hiệu:', err);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    static async getByDanhMuc(req: Request, res: Response): Promise<void> {
        try {
            const danhMucId: string = req.params.danhMucId;

            // Kiểm tra tính hợp lệ của ID
            if (!danhMucId || danhMucId.trim() === '') {
                res.status(400).json({
                    success: false,
                    message: 'ID danh mục không hợp lệ'
                });
                return;
            }

            const sanPhams: SanPham[] = await SanPhamService.getByDanhMucWithImages(danhMucId);

            res.json(sanPhams);

        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm theo danh mục:', error);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // Lấy sản phẩm theo thương hiệu ID
    static async getByThuongHieu(req: Request, res: Response): Promise<void> {
        try {
            const thuongHieuId: string = req.params.thuongHieuId;

            // Kiểm tra tính hợp lệ của ID
            if (!thuongHieuId || thuongHieuId.trim() === '') {
                res.status(400).json({
                    success: false,
                    message: 'ID thương hiệu không hợp lệ'
                });
                return;
            }

            const sanPhams = await SanPhamService.getByThuongHieuWithImages(thuongHieuId);

            res.json(sanPhams);

        } catch (error) {
            console.error('Lỗi khi lấy sản phẩm theo thương hiệu:', error);
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
