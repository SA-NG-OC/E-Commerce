import { Request, Response } from 'express';
import { GioHangService } from '../services/GioHangService';
import { GioHangModel } from '../models/GioHangModel';

export class GioHangController {
    // GET /api/gio-hang/:nguoi_dung_id
    static async getGioHang(req: Request, res: Response) {
        try {
            const nguoi_dung_id: number = Number(req.params.nguoi_dung_id);
            const gioHang = await GioHangService.loadGioHangByNguoiDungId(nguoi_dung_id);
            if (!gioHang) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
            res.json(gioHang);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }

    // DELETE /api/gio-hang/:gio_hang_id/san-pham/:san_pham_id
    static async xoaSanPham(req: Request, res: Response) {
        try {
            const { gio_hang_id, san_pham_id } = req.params;
            await GioHangService.xoaSanPhamKhoiGio(gio_hang_id, san_pham_id);
            res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }

    // PUT /api/gio-hang/:gio_hang_id/san-pham/:san_pham_id
    static async capNhatSoLuong(req: Request, res: Response) {
        try {
            const { gio_hang_id, san_pham_id } = req.params;
            const { so_luong } = req.body;
            await GioHangService.capNhatSoLuong(gio_hang_id, san_pham_id, Number(so_luong));
            res.json({ message: 'Đã cập nhật số lượng sản phẩm' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }
    // POST /api/gio-hang/create/:nguoi_dung_id
    static async createGioHang(req: Request, res: Response) {
        try {
            const nguoi_dung_id: number = Number(req.params.nguoi_dung_id);
            const gioHang: GioHangModel = await GioHangService.createGioHang(nguoi_dung_id);
            res.status(201).json(gioHang);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }
}
