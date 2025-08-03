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
exports.BienTheController = void 0;
const BienTheService_1 = require("../services/BienTheService");
class BienTheController {
    // Sử dụng api http://localhost:3000/api/bien-the/:mauSacId/:kichCoId/:sanPhamId
    static checkExist(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mauSacId, kichCoId, sanPhamId } = req.params;
                const bienTheList = yield BienTheService_1.BienTheService.checkExist(mauSacId, kichCoId, sanPhamId);
                return res.status(200).json(bienTheList);
            }
            catch (error) {
                console.error("Error fetching all Bien The:", error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    // GET /api/bien-the/san-pham/:sanPhamId
    static getByProductId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sanPhamId } = req.params;
            try {
                const bienThes = yield BienTheService_1.BienTheService.getByProductId(sanPhamId);
                res.status(200).json(bienThes);
            }
            catch (error) {
                console.error('Lỗi controller - getByProductId:', error);
                res.status(500).json({ message: 'Lỗi server khi lấy biến thể theo sản phẩm ID' });
            }
        });
    }
    // POST /api/bien-the/
    static createVariant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sanPhamId, tenMau, soKichCo, soLuongTonKho } = req.body;
            try {
                if (!sanPhamId || !tenMau || !soKichCo || soLuongTonKho == null) {
                    res.status(400).json({ message: 'Thiếu thông tin tạo biến thể' });
                    return;
                }
                yield BienTheService_1.BienTheService.createVariantByNames(sanPhamId, tenMau, soKichCo, soLuongTonKho);
                res.status(201).json({ message: 'Tạo biến thể thành công' });
            }
            catch (error) {
                console.error('Lỗi controller - createVariant:', error);
                res.status(500).json({ message: 'Lỗi server khi tạo biến thể' });
            }
        });
    }
    // PUT /api/bien-the/:id
    static updateSoLuong(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { so_luong_ton_kho } = req.body;
                if (!id || typeof so_luong_ton_kho !== 'number') {
                    return res.status(400).json({ success: false, message: 'Thiếu id hoặc số lượng hợp lệ' });
                }
                const success = yield BienTheService_1.BienTheService.updateSoLuongTonKho(id, so_luong_ton_kho);
                if (success) {
                    return res.status(200).json({ success: true, message: 'Cập nhật số lượng thành công' });
                }
                else {
                    return res.status(404).json({ success: false, message: 'Không tìm thấy biến thể để cập nhật' });
                }
            }
            catch (error) {
                console.error('Lỗi khi cập nhật số lượng tồn kho:', error);
                return res.status(500).json({ success: false, message: 'Lỗi server' });
            }
        });
    }
    static deleteBienThe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const success = yield BienTheService_1.BienTheService.deleteBienThe(id);
                if (success) {
                    return res.status(200).json({ message: 'Xóa biến thể thành công.' });
                }
                else {
                    return res.status(404).json({ message: 'Không tìm thấy biến thể để xóa.' });
                }
            }
            catch (error) {
                return res.status(500).json({ message: 'Lỗi server khi xóa biến thể.' });
            }
        });
    }
    // GET /api/bien-the/:id
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ success: false, message: 'Thiếu ID biến thể' });
                }
                const bienThe = yield BienTheService_1.BienTheService.getById(id);
                if (!bienThe) {
                    return res.status(404).json({ success: false, message: 'Không tìm thấy biến thể' });
                }
                return res.status(200).json({
                    success: true,
                    data: {
                        id: bienThe.id,
                        san_pham_id: bienThe.san_pham_id,
                        mau_sac_id: bienThe.mau_sac_id,
                        kich_co_id: bienThe.kich_co_id,
                        so_luong_ton_kho: bienThe.so_luong_ton_kho,
                    }
                });
            }
            catch (error) {
                console.error('Lỗi khi lấy biến thể theo ID:', error);
                return res.status(500).json({ success: false, message: 'Lỗi server' });
            }
        });
    }
}
exports.BienTheController = BienTheController;
