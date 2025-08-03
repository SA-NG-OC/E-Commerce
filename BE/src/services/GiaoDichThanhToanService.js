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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiaoDichThanhToanService = void 0;
const db_1 = __importDefault(require("../config/db"));
const GiaoDichThanhToanModel_1 = require("../models/GiaoDichThanhToanModel");
const crypto_1 = require("crypto");
class GiaoDichThanhToanService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const client = yield db_1.default.connect();
            try {
                // 1. Lấy tổng thanh toán từ đơn hàng
                const donHangRes = yield client.query(`SELECT tong_thanh_toan FROM don_hang WHERE id = $1`, [data.don_hang_id]);
                if (donHangRes.rowCount === 0)
                    return null;
                const tong_thanh_toan = donHangRes.rows[0].tong_thanh_toan;
                // 2. Tạo ID mới dạng TTxxx
                const idRes = yield client.query(`SELECT id FROM giao_dich_thanh_toan WHERE id LIKE 'TT%' ORDER BY id DESC LIMIT 1`);
                let newIdNumber = 1;
                if (idRes.rowCount === 0) {
                    newIdNumber = 1; // Nếu không có giao dịch nào, bắt đầu từ TT001
                }
                else {
                    const lastId = idRes.rows[0].id;
                    const numberPart = parseInt(lastId.replace('TT', ''), 10);
                    newIdNumber = numberPart + 1;
                }
                const newId = 'TT' + newIdNumber.toString().padStart(3, '0');
                // 3. Xác định trạng thái và thông tin thanh toán
                let trang_thai;
                let ma_giao_dich = null;
                let ngay_thanh_toan = null;
                const isCOD = data.phuong_thuc_thanh_toan.trim().toLowerCase() === 'cod';
                if (isCOD) {
                    trang_thai = 'cho_thanh_toan';
                }
                else {
                    trang_thai = 'da_thanh_toan';
                    ma_giao_dich = (0, crypto_1.randomUUID)();
                    ngay_thanh_toan = new Date();
                }
                // 4. Thêm giao dịch vào database
                yield client.query(`INSERT INTO giao_dich_thanh_toan (
                    id, don_hang_id, phuong_thuc_thanh_toan, so_tien,
                    trang_thai, ma_giao_dich, ngay_thanh_toan, ghi_chu
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
                    newId,
                    data.don_hang_id,
                    data.phuong_thuc_thanh_toan,
                    tong_thanh_toan,
                    trang_thai,
                    ma_giao_dich,
                    ngay_thanh_toan,
                    (_a = data.ghi_chu) !== null && _a !== void 0 ? _a : null
                ]);
                return new GiaoDichThanhToanModel_1.GiaoDichThanhToanModel({
                    id: newId,
                    don_hang_id: data.don_hang_id,
                    phuong_thuc_thanh_toan: data.phuong_thuc_thanh_toan,
                    so_tien: tong_thanh_toan,
                    trang_thai,
                    ma_giao_dich,
                    ngay_thanh_toan,
                    ghi_chu: (_b = data.ghi_chu) !== null && _b !== void 0 ? _b : null
                });
            }
            catch (err) {
                console.error('Lỗi khi tạo giao dịch thanh toán:', err);
                return null;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.GiaoDichThanhToanService = GiaoDichThanhToanService;
