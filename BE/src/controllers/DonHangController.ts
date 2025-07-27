import { Request, Response } from 'express';
import { DonHangService } from '../services/DonHangService';


export class DonHangController {
    // Sử dụng api: http:/localhost:3000/api/don-hang/:nguoi_dung_id
    static async getByNguoiDungId(req: Request, res: Response) {
        try {
            const donHangService = new DonHangService();
            const danhSachDonHang = await donHangService.getDonHangByNguoiDungId(req.params.nguoi_dung_id);

            res.json(danhSachDonHang);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', err);
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    static async huyDonHang(req: Request, res: Response) {
        try {
            const { don_hang_id, nguoi_dung_id } = req.params;

            // Kiểm tra tham số bắt buộc
            if (!don_hang_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu mã đơn hàng'
                });
            }

            const donHangService = new DonHangService();
            const result = await donHangService.huyDonHang(don_hang_id, nguoi_dung_id);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: result.message
                });
            } else {
                // Trả về status code tương ứng với từng loại lỗi
                let statusCode = 400;

                if (result.message.includes('Không tìm thấy đơn hàng') ||
                    result.message.includes('không có quyền')) {
                    statusCode = 404;
                } else if (result.message.includes('Chỉ có thể hủy đơn hàng')) {
                    statusCode = 409; // Conflict
                }

                res.status(statusCode).json({
                    success: false,
                    message: result.message
                });
            }
        } catch (err) {
            console.error('Lỗi khi hủy đơn hàng:', err);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    }

}
