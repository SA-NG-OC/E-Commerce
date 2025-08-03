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
exports.GiaoDichThanhToanController = void 0;
const GiaoDichThanhToanService_1 = require("../services/GiaoDichThanhToanService");
class GiaoDichThanhToanController {
    // POST http://localhost:3000/api/thanh-toan
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { don_hang_id, phuong_thuc_thanh_toan, ghi_chu } = req.body;
                if (!don_hang_id || !phuong_thuc_thanh_toan) {
                    res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
                    return;
                }
                const giaoDich = yield GiaoDichThanhToanService_1.GiaoDichThanhToanService.create({
                    don_hang_id,
                    phuong_thuc_thanh_toan,
                    ghi_chu
                });
                if (!giaoDich) {
                    res.status(404).json({ message: 'Không tạo được giao dịch thanh toán' });
                    return;
                }
                res.status(201).json(giaoDich);
            }
            catch (err) {
                console.error('Lỗi trong GiaoDichThanhToanController.create:', err);
                res.status(500).json({ message: 'Lỗi server', error: err });
            }
        });
    }
}
exports.GiaoDichThanhToanController = GiaoDichThanhToanController;
