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
exports.SanPhamController = void 0;
const SanPhamService_1 = require("../services/SanPhamService");
class SanPhamController {
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sanPham = yield SanPhamService_1.SanPhamService.getById(req.params.id);
                if (!sanPham)
                    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
                res.json(sanPham);
            }
            catch (err) {
                console.error('Lỗi khi lấy sản phẩm:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static updateSanPham(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { ten_san_pham, ma_san_pham, mo_ta, gia_ban, ten_danh_muc, ten_thuong_hieu } = req.body;
                const success = yield SanPhamService_1.SanPhamService.updateSanPham(id, {
                    ten_san_pham,
                    ma_san_pham,
                    mo_ta,
                    gia_ban,
                    ten_danh_muc,
                    ten_thuong_hieu
                });
                if (success) {
                    res.json({ message: 'Cập nhật sản phẩm thành công' });
                }
                else {
                    res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
                }
            }
            catch (err) {
                console.error('Lỗi khi cập nhật sản phẩm:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getAllWithImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const danhSach = yield SanPhamService_1.SanPhamService.getAllWithImages();
                res.json(danhSach);
            }
            catch (err) {
                console.error('Lỗi khi lấy danh sách sản phẩm:', err);
                res.status(500).json({ message: 'Lỗi server' });
            }
        });
    }
    static getByDanhMuc_ThuongHieu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { danhMucId, thuongHieuId } = req.params;
                const sanPhams = yield SanPhamService_1.SanPhamService.filterByDanhMucAndThuongHieu(danhMucId, thuongHieuId);
                res.json(sanPhams);
            }
            catch (err) {
                console.error('Lỗi khi lấy sản phẩm theo danh mục và thương hiệu:', err);
                res.status(500).json({ message: 'Lỗi server' });
            }
        });
    }
    static getByDanhMuc(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const danhMucId = req.params.danhMucId;
                // Kiểm tra tính hợp lệ của ID
                if (!danhMucId || danhMucId.trim() === '') {
                    res.status(400).json({
                        success: false,
                        message: 'ID danh mục không hợp lệ'
                    });
                    return;
                }
                const sanPhams = yield SanPhamService_1.SanPhamService.getByDanhMucWithImages(danhMucId);
                res.json(sanPhams);
            }
            catch (error) {
                console.error('Lỗi khi lấy sản phẩm theo danh mục:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
        });
    }
    // Lấy sản phẩm theo thương hiệu ID
    static getByThuongHieu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const thuongHieuId = req.params.thuongHieuId;
                // Kiểm tra tính hợp lệ của ID
                if (!thuongHieuId || thuongHieuId.trim() === '') {
                    res.status(400).json({
                        success: false,
                        message: 'ID thương hiệu không hợp lệ'
                    });
                    return;
                }
                const sanPhams = yield SanPhamService_1.SanPhamService.getByThuongHieuWithImages(thuongHieuId);
                res.json(sanPhams);
            }
            catch (error) {
                console.error('Lỗi khi lấy sản phẩm theo thương hiệu:', error);
                res.status(500).json({ message: 'Lỗi server' });
            }
        });
    }
}
exports.SanPhamController = SanPhamController;
