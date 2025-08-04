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

    // Sử dụng api: http:/localhost:3000/api/don-hang/
    static async getAllDonHang(req: Request, res: Response) {
        try {
            const donHangService = new DonHangService();
            const donHangList = await donHangService.getAllDonHang();
            return res.status(200).json(donHangList);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            return res.status(500).json({ message: 'Lỗi server khi lấy danh sách đơn hàng' });
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

    // ✅ Tạo đơn hàng mới
    // Sử dụng api: http://localhost:3000/api/don-hang/tao
    static async createDonHang(req: Request, res: Response) {
        try {
            const { nguoi_dung_id } = req.body;

            if (!nguoi_dung_id) {
                return res.status(400).json({ success: false, message: 'Thiếu nguoi_dung_id' });
            }

            const donHangService = new DonHangService();
            const newId = await donHangService.createDonHang(nguoi_dung_id);

            if (newId) {
                res.status(201).json({ success: true, id: newId });
            } else {
                res.status(500).json({ success: false, message: 'Không thể tạo đơn hàng' });
            }

        } catch (err) {
            console.error('Lỗi khi tạo đơn hàng:', err);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }

    //Sử dụng api http://localhost:3000/api/don-hang/:id
    static async deleteDonHang(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ success: false, message: 'Thiếu id đơn hàng' });
            }

            const donHangService = new DonHangService();
            const result = await donHangService.xoaDonHang(id);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }

        } catch (err) {
            console.error('Lỗi khi xóa đơn hàng:', err);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }


    // ✅ Thêm chi tiết đơn hàng
    // Sử dụng api: http://localhost:3000/api/don-hang/chi-tiet/them
    static async addChiTietDonHang(req: Request, res: Response) {
        try {
            const { don_hang_id, bien_the_id, so_luong } = req.body;

            if (!don_hang_id || !bien_the_id || !so_luong) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc (don_hang_id, bien_the_id, so_luong)'
                });
            }

            const donHangService = new DonHangService();
            const newCTId = await donHangService.addChiTietDonHang(don_hang_id, bien_the_id, parseInt(so_luong));

            if (newCTId) {
                res.status(201).json({ success: true, id: newCTId });
            } else {
                res.status(500).json({ success: false, message: 'Không thể thêm chi tiết đơn hàng' });
            }

        } catch (err) {
            console.error('Lỗi khi thêm chi tiết đơn hàng:', err);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }

    // PUT /api/don-hang/cap-nhat-trang-thai/:id
    static async capNhatTrangThaiDonHang(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { trang_thai } = req.body;

            if (!id || !trang_thai) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc (id, trang_thai)'
                });
            }

            const donHangService = new DonHangService();
            const result = await donHangService.capNhatTrangThaiDonHang(id, trang_thai);

            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: result.message
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: result.message
                });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    }


}
