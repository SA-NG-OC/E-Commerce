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

    // Có thể thêm các hàm khác ở đây như:
    // static async getAll() {...}
    // static async getById() {...}
}
