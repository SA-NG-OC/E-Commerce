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
exports.DanhGiaSPService = void 0;
const db_1 = __importDefault(require("../config/db"));
const DanhGiaSPModel_1 = require("../models/DanhGiaSPModel");
class DanhGiaSPService {
    static update(id, noi_dung_danh_gia, diem_danh_gia) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const result = yield db_1.default.query(`
            UPDATE danh_gia_san_pham
            SET noi_dung_danh_gia = $1, diem_danh_gia = $2
            WHERE id = $3
            RETURNING *
        `, [noi_dung_danh_gia, diem_danh_gia, id]);
            const row = result.rows[0];
            if (!row)
                return null;
            let hoTenNguoiDung = undefined;
            if (row.nguoi_dung_id) {
                const userRes = yield db_1.default.query('SELECT ho, ten FROM nguoi_dung WHERE id = $1', [row.nguoi_dung_id]);
                if (userRes.rows.length > 0) {
                    hoTenNguoiDung = `${((_a = userRes.rows[0].ho) === null || _a === void 0 ? void 0 : _a.trim()) || ''} ${((_b = userRes.rows[0].ten) === null || _b === void 0 ? void 0 : _b.trim()) || ''}`.trim();
                }
            }
            return new DanhGiaSPModel_1.DanhGiaSPModel({
                id: row.id,
                san_pham_id: row.san_pham_id,
                nguoi_dung_id: row.nguoi_dung_id,
                diem_danh_gia: row.diem_danh_gia,
                noi_dung_danh_gia: row.noi_dung_danh_gia,
                ngay_tao: row.ngay_tao,
                ho_ten_nguoi_dung: hoTenNguoiDung
            });
        });
    }
    static getBySanPhamId(san_pham_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
            SELECT dg.*, CONCAT(nd.ho, ' ', nd.ten) AS ho_ten_nguoi_dung
            FROM danh_gia_san_pham dg
            JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id
            WHERE dg.san_pham_id = $1
            ORDER BY dg.ngay_tao DESC
        `, [san_pham_id]);
            return result.rows.map(row => {
                var _a;
                return new DanhGiaSPModel_1.DanhGiaSPModel({
                    id: row.id,
                    san_pham_id: row.san_pham_id,
                    nguoi_dung_id: row.nguoi_dung_id,
                    diem_danh_gia: row.diem_danh_gia,
                    noi_dung_danh_gia: row.noi_dung_danh_gia,
                    ngay_tao: row.ngay_tao,
                    ho_ten_nguoi_dung: ((_a = row.ho_ten_nguoi_dung) === null || _a === void 0 ? void 0 : _a.trim()) || undefined
                });
            });
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('DELETE FROM danh_gia_san_pham WHERE id = $1', [id]);
            return !!result.rowCount && result.rowCount > 0;
        });
    }
    static create(danhGia) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const result = yield db_1.default.query(`
            INSERT INTO danh_gia_san_pham (id, san_pham_id, nguoi_dung_id, diem_danh_gia, noi_dung_danh_gia, ngay_tao)
            VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *
        `, [
                danhGia.id,
                danhGia.san_pham_id,
                danhGia.nguoi_dung_id,
                danhGia.diem_danh_gia,
                danhGia.noi_dung_danh_gia
            ]);
            const row = result.rows[0];
            let hoTenNguoiDung = undefined;
            if (row.nguoi_dung_id) {
                const userRes = yield db_1.default.query('SELECT ho, ten FROM nguoi_dung WHERE id = $1', [row.nguoi_dung_id]);
                if (userRes.rows.length > 0) {
                    hoTenNguoiDung = `${((_a = userRes.rows[0].ho) === null || _a === void 0 ? void 0 : _a.trim()) || ''} ${((_b = userRes.rows[0].ten) === null || _b === void 0 ? void 0 : _b.trim()) || ''}`.trim();
                }
            }
            return new DanhGiaSPModel_1.DanhGiaSPModel({
                id: row.id,
                san_pham_id: row.san_pham_id,
                nguoi_dung_id: row.nguoi_dung_id,
                diem_danh_gia: row.diem_danh_gia,
                noi_dung_danh_gia: row.noi_dung_danh_gia,
                ngay_tao: row.ngay_tao,
                ho_ten_nguoi_dung: hoTenNguoiDung
            });
        });
    }
    static generateNewId() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
        SELECT id FROM danh_gia_san_pham 
        WHERE id LIKE 'DG%' 
        ORDER BY LENGTH(id) DESC, id DESC 
        LIMIT 1
    `);
            if (result.rows.length === 0) {
                return 'DG001';
            }
            const lastId = result.rows[0].id; // VD: "DG015"
            const numberPart = parseInt(lastId.replace('DG', ''), 10); // 15
            const newNumber = numberPart + 1;
            const newId = 'DG' + newNumber.toString().padStart(3, '0'); // => "DG016"
            return newId;
        });
    }
}
exports.DanhGiaSPService = DanhGiaSPService;
