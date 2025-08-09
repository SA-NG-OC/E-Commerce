import { Request, Response } from 'express';
import { DiaChiGiaoHangService } from '../services/DiaChiGiaoHangService';
import { DiaChiGiaoHangModel } from '../models/DiaChiGiaoHangModel';

export class DiaChiGiaoHangController {
    // POST /api/dia-chi
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

    //Sử dụng http://localhost:3000/dia-chi/:donHangId
    static async getByDonHangId(req: Request, res: Response): Promise<void> {
        const { donHangId } = req.params;

        try {
            const diaChi = await DiaChiGiaoHangService.findByDonHangId(donHangId);
            if (!diaChi) {
                res.status(404).json({ message: 'Không tìm thấy địa chỉ giao hàng.' });
                return;
            }
            res.json(diaChi);
        } catch (err) {
            console.error('Lỗi khi lấy địa chỉ:', err);
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }

    //Sử dụng http://localhost:3000/dia-chi/:addressId
    static async update(req: Request, res: Response) {
        try {
            const { addressId } = req.params;
            const rawData = req.body;

            // Chuẩn hóa dữ liệu - xóa dấu gạch dưới nếu có
            const normalizedData = {
                ho_ten_nguoi_nhan: rawData._ho_ten_nguoi_nhan || rawData.ho_ten_nguoi_nhan,
                so_dien_thoai: rawData._so_dien_thoai || rawData.so_dien_thoai,
                dia_chi_chi_tiet: rawData._dia_chi_chi_tiet || rawData.dia_chi_chi_tiet,
                phuong_xa: rawData._phuong_xa || rawData.phuong_xa,
                tinh_thanh: rawData._tinh_thanh || rawData.tinh_thanh,
                ghi_chu: rawData._ghi_chu || rawData.ghi_chu
            };

            // Validation đơn giản hơn
            if (!normalizedData.ho_ten_nguoi_nhan?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Họ tên người nhận là bắt buộc'
                });
            }

            if (!normalizedData.so_dien_thoai?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Số điện thoại là bắt buộc'
                });
            }

            if (!normalizedData.dia_chi_chi_tiet?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Địa chỉ chi tiết là bắt buộc'
                });
            }

            if (!normalizedData.phuong_xa?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Phường/Xã là bắt buộc'
                });
            }

            if (!normalizedData.tinh_thanh?.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Tỉnh/Thành là bắt buộc'
                });
            }

            const updated = await DiaChiGiaoHangService.update(addressId, normalizedData);

            if (!updated) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy địa chỉ'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Cập nhật địa chỉ thành công',
                data: updated
            });
        } catch (err) {
            console.error('Lỗi controller cập nhật địa chỉ:', err);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    }

}
