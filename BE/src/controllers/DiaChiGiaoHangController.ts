import { Request, Response } from 'express';
import { DiaChiGiaoHangService } from '../services/DiaChiGiaoHangService';

export class DiaChiGiaoHangController {
    // POST /api/dia-chi-giao-hang
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const {
                don_hang_id,
                ho_ten_nguoi_nhan,
                so_dien_thoai,
                dia_chi_chi_tiet,
                phuong_xa,
                tinh_thanh,
                ghi_chu
            } = req.body;

            // Kiểm tra dữ liệu đầu vào
            if (!don_hang_id || !ho_ten_nguoi_nhan || !so_dien_thoai || !dia_chi_chi_tiet) {
                res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
                return;
            }

            const newDiaChi = await DiaChiGiaoHangService.create({
                don_hang_id,
                ho_ten_nguoi_nhan,
                so_dien_thoai,
                dia_chi_chi_tiet,
                phuong_xa,
                tinh_thanh,
                ghi_chu
            });

            res.status(201).json(newDiaChi);
        } catch (err) {
            console.error('Lỗi khi tạo địa chỉ giao hàng:', err);
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }
}
