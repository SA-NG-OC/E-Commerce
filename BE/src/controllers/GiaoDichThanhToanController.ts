import { Request, Response } from 'express';
import { GiaoDichThanhToanService } from '../services/GiaoDichThanhToanService';

export class GiaoDichThanhToanController {
    // POST http://localhost:3000/api/thanh-toan
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { don_hang_id, phuong_thuc_thanh_toan, ghi_chu } = req.body;

            if (!don_hang_id || !phuong_thuc_thanh_toan) {
                res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
                return;
            }

            const giaoDich = await GiaoDichThanhToanService.create({
                don_hang_id,
                phuong_thuc_thanh_toan,
                ghi_chu
            });

            if (!giaoDich) {
                res.status(404).json({ message: 'Không tạo được giao dịch thanh toán' });
                return;
            }

            res.status(201).json(giaoDich);
        } catch (err) {
            console.error('Lỗi trong GiaoDichThanhToanController.create:', err);
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }

    //Sử dụng http://localhost:3000/api/giao-dich/:donHangId
    static async getByDonHangId(req: Request, res: Response) {
        const { donHangId } = req.params;

        try {
            const giaoDich = await GiaoDichThanhToanService.findByDonHangId(donHangId);
            if (!giaoDich) {
                return res.status(404).json({ message: 'Không tìm thấy giao dịch thanh toán.' });
            }
            res.json(giaoDich);
        } catch (err) {
            console.error('Lỗi khi lấy giao dịch:', err);
            res.status(500).json({ message: 'Lỗi server.' });
        }
    }

    // Sử dụng http://localhost:3000/api/giao-dich
    static async getAll(req: Request, res: Response) {
        try {
            const giaoDichList = await GiaoDichThanhToanService.getAll();
            res.json(giaoDichList);
        } catch (err) {
            console.error('Lỗi khi lấy danh sách giao dịch:', err);
            res.status(500).json({ message: 'Lỗi server.' });
        }
    }

    static async updateStatus(req: Request, res: Response) {
        try {
            const { paymentId } = req.params;
            const { trang_thai } = req.body;

            if (!trang_thai) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu trạng thái mới'
                });
            }

            const updated = await GiaoDichThanhToanService.updateStatus(paymentId, trang_thai);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy giao dịch'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Cập nhật trạng thái giao dịch thành công',
                data: updated
            });
        } catch (err) {
            console.error('Lỗi controller cập nhật trạng thái:', err);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    }


    // Có thể thêm các hàm khác ở đây như:
    // static async getAll() {...}
    // static async getById() {...}
}
