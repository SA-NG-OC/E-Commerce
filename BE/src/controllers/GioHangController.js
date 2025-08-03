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
exports.GioHangController = void 0;
const GioHangService_1 = require("../services/GioHangService");
class GioHangController {
    // GET /api/gio-hang/:nguoi_dung_id
    static getGioHang(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nguoi_dung_id = req.params.nguoi_dung_id;
                if (!nguoi_dung_id) {
                    res.status(400).json({ message: 'ID người dùng không hợp lệ' });
                    return;
                }
                const gioHang = yield GioHangService_1.GioHangService.loadGioHangByNguoiDungId(nguoi_dung_id);
                if (!gioHang) {
                    res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
                    return;
                }
                res.status(200).json(gioHang);
            }
            catch (err) {
                res.status(500).json({ message: 'Lỗi server', error: err });
            }
        });
    }
    // POST /api/gio-hang/them
    static themSanPhamVaoGioHang(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nguoi_dung_id, bien_the_id, so_luong } = req.body;
                // Kiểm tra dữ liệu đầu vào
                if (!nguoi_dung_id || !bien_the_id || !so_luong || isNaN(so_luong) || so_luong <= 0) {
                    res.status(400).json({ message: 'Dữ liệu đầu vào không hợp lệ' });
                    return;
                }
                yield GioHangService_1.GioHangService.addSanPhamToGioHang(nguoi_dung_id, bien_the_id, so_luong);
                res.status(201).json({ message: 'Thêm sản phẩm vào giỏ hàng thành công' });
            }
            catch (err) {
                res.status(500).json({ message: 'Lỗi server khi thêm sản phẩm vào giỏ hàng', error: err });
            }
        });
    }
    // DELETE /api/gio-hang/:gio_hang_id/bien-the/:bien_the_id
    static xoaSanPham(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gio_hang_id = req.params.gio_hang_id;
                const bien_the_id = req.params.bien_the_id;
                if (!gio_hang_id || !bien_the_id) {
                    res.status(400).json({ message: 'Tham số không hợp lệ' });
                    return;
                }
                yield GioHangService_1.GioHangService.xoaSanPhamKhoiGio(gio_hang_id, bien_the_id);
                res.json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
            }
            catch (err) {
                res.status(500).json({ message: 'Lỗi server', error: err });
            }
        });
    }
    // PUT /api/gio-hang/:gio_hang_id/bien-the/:bien_the_id
    static capNhatSoLuong(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gio_hang_id = req.params.gio_hang_id;
                const bien_the_id = req.params.bien_the_id;
                const so_luong = parseInt(req.body.so_luong, 10);
                if (!gio_hang_id || !bien_the_id || isNaN(so_luong)) {
                    res.status(400).json({ message: 'Tham số không hợp lệ' });
                    return;
                }
                yield GioHangService_1.GioHangService.capNhatSoLuong(gio_hang_id, bien_the_id, so_luong);
                res.json({ message: 'Đã cập nhật số lượng sản phẩm' });
            }
            catch (err) {
                res.status(500).json({ message: 'Lỗi server', error: err });
            }
        });
    }
    // POST /api/gio-hang/create/:nguoi_dung_id
    static createGioHang(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const nguoi_dung_id = req.params.nguoi_dung_id;
                if (!nguoi_dung_id) {
                    res.status(400).json({ message: 'ID người dùng không hợp lệ' });
                    return;
                }
                const gioHang = yield GioHangService_1.GioHangService.createGioHang(nguoi_dung_id);
                res.status(201).json(gioHang);
            }
            catch (err) {
                res.status(500).json({ message: 'Lỗi server', error: err });
            }
        });
    }
}
exports.GioHangController = GioHangController;
