"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonHangController = void 0;
const DonHangService_1 = require("../services/DonHangService");
class DonHangController {
    // Sử dụng api: http:/localhost:3000/api/don-hang/:nguoi_dung_id
    static getByNguoiDungId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const donHangService = new DonHangService_1.DonHangService();
                const danhSachDonHang = yield donHangService.getDonHangByNguoiDungId(req.params.nguoi_dung_id);
                res.json(danhSachDonHang);
            }
            catch (err) {
                console.error('Lỗi khi lấy danh sách đơn hàng:', err);
                res.status(500).json({ message: 'Lỗi server' });
            }
        });
    }
    static huyDonHang(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { don_hang_id, nguoi_dung_id } = req.params;
                // Kiểm tra tham số bắt buộc
                if (!don_hang_id) {
                    return res.status(400).json({
                        success: false,
                        message: 'Thiếu mã đơn hàng'
                    });
                }
                const donHangService = new DonHangService_1.DonHangService();
                const result = yield donHangService.huyDonHang(don_hang_id, nguoi_dung_id);
                if (result.success) {
                    res.status(200).json({
                        success: true,
                        message: result.message
                    });
                }
                else {
                    // Trả về status code tương ứng với từng loại lỗi
                    let statusCode = 400;
                    if (result.message.includes('Không tìm thấy đơn hàng') ||
                        result.message.includes('không có quyền')) {
                        statusCode = 404;
                    }
                    else if (result.message.includes('Chỉ có thể hủy đơn hàng')) {
                        statusCode = 409; // Conflict
                    }
                    res.status(statusCode).json({
                        success: false,
                        message: result.message
                    });
                }
            }
            catch (err) {
                console.error('Lỗi khi hủy đơn hàng:', err);
                res.status(500).json({
                    success: false,
                    message: 'Lỗi server'
                });
            }
        });
    }
    // ✅ Tạo đơn hàng mới
    // Sử dụng api: http://localhost:3000/api/don-hang/tao
    static createDonHang(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nguoi_dung_id } = req.body;
                if (!nguoi_dung_id) {
                    return res.status(400).json({ success: false, message: 'Thiếu nguoi_dung_id' });
                }
                const donHangService = new DonHangService_1.DonHangService();
                const newId = yield donHangService.createDonHang(nguoi_dung_id);
                if (newId) {
                    res.status(201).json({ success: true, id: newId });
                }
                else {
                    res.status(500).json({ success: false, message: 'Không thể tạo đơn hàng' });
                }
            }
            catch (err) {
                console.error('Lỗi khi tạo đơn hàng:', err);
                res.status(500).json({ success: false, message: 'Lỗi server' });
            }
        });
    }
    static deleteDonHang(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ success: false, message: 'Thiếu id đơn hàng' });
                }
                const donHangService = new DonHangService_1.DonHangService();
                const result = yield donHangService.xoaDonHang(id);
                if (result.success) {
                    res.status(200).json(result);
                }
                else {
                    res.status(404).json(result);
                }
            }
            catch (err) {
                console.error('Lỗi khi xóa đơn hàng:', err);
                res.status(500).json({ success: false, message: 'Lỗi server' });
            }
        });
    }
    // ✅ Thêm chi tiết đơn hàng
    // Sử dụng api: http://localhost:3000/api/don-hang/chi-tiet/them
    static addChiTietDonHang(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { don_hang_id, bien_the_id, so_luong } = req.body;
                if (!don_hang_id || !bien_the_id || !so_luong) {
                    return res.status(400).json({
                        success: false,
                        message: 'Thiếu thông tin bắt buộc (don_hang_id, bien_the_id, so_luong)'
                    });
                }
                const donHangService = new DonHangService_1.DonHangService();
                const newCTId = yield donHangService.addChiTietDonHang(don_hang_id, bien_the_id, parseInt(so_luong));
                if (newCTId) {
                    res.status(201).json({ success: true, id: newCTId });
                }
                else {
                    res.status(500).json({ success: false, message: 'Không thể thêm chi tiết đơn hàng' });
                }
            }
            catch (err) {
                console.error('Lỗi khi thêm chi tiết đơn hàng:', err);
                res.status(500).json({ success: false, message: 'Lỗi server' });
            }
        });
    }
}
exports.DonHangController = DonHangController;
