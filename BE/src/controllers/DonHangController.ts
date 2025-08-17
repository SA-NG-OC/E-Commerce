import { Request, Response } from 'express';
import { DonHangService } from '../services/DonHangService';
import { Server } from 'socket.io';

export class DonHangController {
    private donHangService: DonHangService;

    constructor(io: Server) {
        this.donHangService = new DonHangService(io);
    }

    // GET /api/don-hang/:nguoi_dung_id - Trả về data thuần
    getByNguoiDungId = async (req: Request, res: Response) => {
        try {
            const { nguoi_dung_id } = req.params;

            if (!nguoi_dung_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu ID người dùng'
                });
            }

            const danhSachDonHang = await this.donHangService.getDonHangByNguoiDungId(nguoi_dung_id);

            res.status(200).json(danhSachDonHang); // Trả về data thuần
        } catch (err) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', err);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    };

    // GET /api/don-hang/ - Trả về data thuần
    getAllDonHang = async (req: Request, res: Response) => {
        try {
            const donHangList = await this.donHangService.getAllDonHang();

            res.status(200).json(donHangList); // Trả về data thuần
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy danh sách đơn hàng'
            });
        }
    };

    // GET /api/don-hang/count - Trả về số thuần
    countDonHang = async (req: Request, res: Response) => {
        try {
            const total = await this.donHangService.countDonHang();

            res.status(200).json({ total: total });

        } catch (error) {
            console.error('Lỗi khi đếm số đơn hàng:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi đếm số đơn hàng'
            });
        }
    };

    // POST /api/don-hang/tao - Trả về ID thuần
    createDonHang = async (req: Request, res: Response) => {
        try {
            const { nguoi_dung_id } = req.body;

            if (!nguoi_dung_id) {
                return res.status(400).json({ success: false, message: 'Thiếu nguoi_dung_id' });
            }

            const newId = await this.donHangService.createDonHang(nguoi_dung_id);

            if (newId) {
                res.status(201).json({ success: true, id: newId });
            } else {
                res.status(500).json({ success: false, message: 'Không thể tạo đơn hàng' });
            }

        } catch (err) {
            console.error('Lỗi khi tạo đơn hàng:', err);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    };

    // POST /api/don-hang/chi-tiet/them - Trả về ID thuần
    addChiTietDonHang = async (req: Request, res: Response) => {
        try {
            const { don_hang_id, bien_the_id, so_luong } = req.body;

            if (!don_hang_id || !bien_the_id || !so_luong) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu thông tin bắt buộc (don_hang_id, bien_the_id, so_luong)'
                });
            }

            const newCTId = await this.donHangService.addChiTietDonHang(don_hang_id, bien_the_id, parseInt(so_luong));

            if (newCTId) {
                res.status(201).json({ success: true, id: newCTId });
            } else {
                res.status(500).json({ success: false, message: 'Không thể thêm chi tiết đơn hàng' });
            }

        } catch (err) {
            console.error('Lỗi khi thêm chi tiết đơn hàng:', err);
            res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    };

    // ===== CÁC METHOD CẬP NHẬT/XÓA - GIỮ NGUYÊN FORMAT SUCCESS/MESSAGE =====

    // PUT /api/don-hang/cap-nhat-trang-thai/:id - Giữ nguyên format
    capNhatTrangThai = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { trang_thai } = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu ID đơn hàng'
                });
            }

            if (!trang_thai) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu trường trạng thái'
                });
            }

            // Kiểm tra trạng thái hợp lệ
            const validStatuses = [
                'cho_xac_nhan',
                'da_xac_nhan',
                'dang_chuan_bi',
                'dang_giao_hang',
                'da_giao_hang',
                'da_huy',
                'hoan_tra'
            ];

            if (!validStatuses.includes(trang_thai)) {
                return res.status(400).json({
                    success: false,
                    message: 'Trạng thái không hợp lệ'
                });
            }

            const result = await this.donHangService.capNhatTrangThai(id, trang_thai);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    };

    // PATCH /api/don-hang/huy/:don_hang_id/:nguoi_dung_id hoặc /api/don-hang/huy/:don_hang_id - Giữ nguyên format
    huyDonHang = async (req: Request, res: Response) => {
        try {
            const { don_hang_id, nguoi_dung_id } = req.params;

            if (!don_hang_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu mã đơn hàng'
                });
            }

            const result = await this.donHangService.huyDonHang(don_hang_id, nguoi_dung_id);

            if (result.success) {
                res.status(200).json(result);
            } else {
                let statusCode = 400;

                if (result.message.includes('Không tìm thấy đơn hàng') ||
                    result.message.includes('không có quyền')) {
                    statusCode = 404;
                } else if (result.message.includes('Chỉ có thể hủy đơn hàng')) {
                    statusCode = 409;
                }

                res.status(statusCode).json(result);
            }
        } catch (err) {
            console.error('Lỗi khi hủy đơn hàng:', err);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    };

    // DELETE /api/don-hang/:id - Giữ nguyên format
    xoaDonHang = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu id đơn hàng'
                });
            }

            const result = await this.donHangService.xoaDonHang(id);

            if (result.success) {
                res.status(200).json(result);
            } else {
                res.status(404).json(result);
            }

        } catch (err) {
            console.error('Lỗi khi xóa đơn hàng:', err);
            res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    };
}