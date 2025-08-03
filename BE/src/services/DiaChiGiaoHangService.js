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
exports.DiaChiGiaoHangService = void 0;
const db_1 = __importDefault(require("../config/db"));
const DiaChiGiaoHangModel_1 = require("../models/DiaChiGiaoHangModel");
class DiaChiGiaoHangService {
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.default.connect();
            try {
                // Lấy ID lớn nhất hiện có
                const { rows } = yield client.query(`SELECT id FROM dia_chi_giao_hang ORDER BY id DESC LIMIT 1`);
                let newId = 'DC001';
                if (rows.length > 0) {
                    const lastId = rows[0].id; // e.g., 'DC007'
                    const lastNumber = parseInt(lastId.replace('DC', ''), 10);
                    const nextNumber = lastNumber + 1;
                    newId = 'DC' + nextNumber.toString().padStart(3, '0');
                }
                // Insert vào DB
                const insertQuery = `
                INSERT INTO dia_chi_giao_hang (
                    id, don_hang_id, ho_ten_nguoi_nhan, so_dien_thoai,
                    dia_chi_chi_tiet, phuong_xa, tinh_thanh, ghi_chu
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING *;
            `;
                const values = [
                    newId,
                    data.don_hang_id,
                    data.ho_ten_nguoi_nhan,
                    data.so_dien_thoai,
                    data.dia_chi_chi_tiet,
                    data.phuong_xa,
                    data.tinh_thanh,
                    data.ghi_chu,
                ];
                const result = yield client.query(insertQuery, values);
                const inserted = result.rows[0];
                return new DiaChiGiaoHangModel_1.DiaChiGiaoHangModel(inserted);
            }
            catch (err) {
                throw err;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.DiaChiGiaoHangService = DiaChiGiaoHangService;
