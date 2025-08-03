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
exports.DiaChiGiaoHangController = void 0;
const DiaChiGiaoHangService_1 = require("../services/DiaChiGiaoHangService");
class DiaChiGiaoHangController {
    // POST /api/dia-chi-giao-hang
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { don_hang_id, ho_ten_nguoi_nhan, so_dien_thoai, dia_chi_chi_tiet, phuong_xa, tinh_thanh, ghi_chu } = req.body;
                // Kiểm tra dữ liệu đầu vào
                if (!don_hang_id || !ho_ten_nguoi_nhan || !so_dien_thoai || !dia_chi_chi_tiet) {
                    res.status(400).json({ message: 'Thiếu thông tin bắt buộc.' });
                    return;
                }
                const newDiaChi = yield DiaChiGiaoHangService_1.DiaChiGiaoHangService.create({
                    don_hang_id,
                    ho_ten_nguoi_nhan,
                    so_dien_thoai,
                    dia_chi_chi_tiet,
                    phuong_xa,
                    tinh_thanh,
                    ghi_chu
                });
                res.status(201).json(newDiaChi);
            }
            catch (err) {
                console.error('Lỗi khi tạo địa chỉ giao hàng:', err);
                res.status(500).json({ message: 'Lỗi server', error: err });
            }
        });
    }
}
exports.DiaChiGiaoHangController = DiaChiGiaoHangController;
