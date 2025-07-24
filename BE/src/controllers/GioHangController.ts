import { Request, Response } from 'express';
import { GioHangService } from '../services/GioHangService';
import { GioHangModel } from '../models/GioHangModel';

export class GioHangController {
    // GET /api/gio-hang/:nguoi_dung_id
    static async getGioHang(req: Request, res: Response): Promise<void> {
        try {
            const nguoi_dung_id = req.params.nguoi_dung_id;
            if (!nguoi_dung_id) {
                res.status(400).json({ message: 'ID người dùng không hợp lệ' });
                return;
            }

            const gioHang = await GioHangService.loadGioHangByNguoiDungId(nguoi_dung_id);
            if (!gioHang) {
                res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
                return;
            }

            res.status(200).json(gioHang);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }

    // DELETE /api/gio-hang/:gio_hang_id/bien-the/:bien_the_id
    static async xoaSanPham(req: Request, res: Response): Promise<void> {
        try {
            const gio_hang_id = req.params.gio_hang_id;
            const bien_the_id = req.params.bien_the_id;

            if (!gio_hang_id || !bien_the_id) {
                res.status(400).json({ message: 'Tham số không hợp lệ' });
                return;
            }

            await GioHangService.xoaSanPhamKhoiGio(gio_hang_id, bien_the_id);
            res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }

    // PUT /api/gio-hang/:gio_hang_id/bien-the/:bien_the_id
    static async capNhatSoLuong(req: Request, res: Response): Promise<void> {
        try {
            const gio_hang_id = req.params.gio_hang_id;
            const bien_the_id = req.params.bien_the_id;
            const so_luong = parseInt(req.body.so_luong, 10);

            if (!gio_hang_id || !bien_the_id || isNaN(so_luong)) {
                res.status(400).json({ message: 'Tham số không hợp lệ' });
                return;
            }

            await GioHangService.capNhatSoLuong(gio_hang_id, bien_the_id, so_luong);
            res.json({ message: 'Đã cập nhật số lượng sản phẩm' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }

    // POST /api/gio-hang/create/:nguoi_dung_id
    static async createGioHang(req: Request, res: Response): Promise<void> {
        try {
            const nguoi_dung_id = req.params.nguoi_dung_id;
            if (!nguoi_dung_id) {
                res.status(400).json({ message: 'ID người dùng không hợp lệ' });
                return;
            }

            const gioHang: GioHangModel = await GioHangService.createGioHang(nguoi_dung_id);
            res.status(201).json(gioHang);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }
}
