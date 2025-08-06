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
    static async updateSanPham(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const {
                ten_san_pham,
                ma_san_pham,
                mo_ta,
                gia_ban,
                ten_danh_muc,
                ten_thuong_hieu
            } = req.body;

            const success = await SanPhamService.updateSanPham(id, {
                ten_san_pham,
                ma_san_pham,
                mo_ta,
                gia_ban,
                ten_danh_muc,
                ten_thuong_hieu
            });

            if (success) {
                res.json({ message: 'Cập nhật sản phẩm thành công' });
            } else {
                res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật sản phẩm:', err);
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
            const { danhMucId, thuongHieuId } = req.params;
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
    // sử dụng http://localhost:3000/api/san-pham/ 
    static async createSanPham(req: Request, res: Response) {
        try {
            const {
                ten_san_pham,
                ma_san_pham,
                mo_ta,
                gia_ban,
                ten_danh_muc,
                ten_thuong_hieu
            } = req.body;

            const success: string | null = await SanPhamService.createSanPham({
                ten_san_pham,
                ma_san_pham,
                mo_ta,
                gia_ban,
                ten_danh_muc,
                ten_thuong_hieu
            });

            if (success) {
                res.status(201).json({ message: 'Thêm sản phẩm thành công', id: success });
            } else {
                res.status(400).json({ message: 'Không thể thêm sản phẩm' });
            }
        } catch (err) {
            console.error('Lỗi khi thêm sản phẩm:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    // sử dụng api http://localhost:3000/api/san-pham/:id/soft-delete
    static async deleteSanPhamAo(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const success = await SanPhamService.deleteSanPhamAo(id);
            if (success) {
                return res.status(200).json({ message: 'Xóa ảo sản phẩm thành công.' });
            }
        } catch (error) {
            console.error('Lỗi khi xóa ảo sản phẩm:', error);
            return res.status(500).json({ message: 'Xóa sản phẩm không thành.' });
        }
    }
    // http://localhost:3000/api/san-pham/id
    static async getIdSanPham(req: Request, res: Response) {
        const sp: { id: string, ten_san_pham: string }[] = await SanPhamService.getIdSanPham();
        if (sp.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        return res.status(200).json(sp);
    }
    // http://localhost:3000/api/san-pham/update-danh-muc
    static async updateDanhMucSanPham(req: Request, res: Response) {
        const { sanPhamId, danhMucId } = req.body;
        const success = await SanPhamService.updateDanhMucSanPham(sanPhamId, danhMucId);
        if (!success) {
            return res.status(400).json({ message: 'Cập nhật danh mục thất bại' });
        }
        return res.status(200).json({ message: 'Cập nhật danh mục thành công' });
    }

    // http://localhost:3000/api/san-pham/update-thuong-hieu
    static async updateThuongHieuSanPham(req: Request, res: Response) {
        const { sanPhamId, thuongHieuId } = req.body;
        const success = await SanPhamService.updateThuongHieuSanPham(sanPhamId, thuongHieuId);
        if (!success) {
            return res.status(400).json({ message: 'Cập nhật thương hiệu thất bại' });
        }
        return res.status(200).json({ message: 'Cập nhật thương hiệu thành công' });
    }

}
