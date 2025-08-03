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
exports.BienTheService = void 0;
const BienTheSPModel_1 = require("../models/BienTheSPModel");
const db_1 = __importDefault(require("../config/db"));
class BienTheService {
    static checkExist(id_mau, id_kich_co, id_san_pham) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = yield db_1.default.query(`
                SELECT b.*, ms.ten_mau, ms.ma_mau, kc.so_kich_co 
                FROM bien_the_san_pham b
                JOIN mau_sac ms ON b.mau_sac_id = ms.id
                JOIN kich_co kc ON b.kich_co_id = kc.id
                WHERE b.mau_sac_id = $1 AND b.kich_co_id = $2 AND b.san_pham_id = $3
            `, [id_mau, id_kich_co, id_san_pham]);
                if (query.rows.length === 0)
                    return null;
                const row = query.rows[0];
                return new BienTheSPModel_1.BienTheSPModel({
                    id: row.id,
                    san_pham_id: row.san_pham_id,
                    mau_sac_id: row.mau_sac_id,
                    mau_sac: row.ten_mau,
                    ma_mau: row.ma_mau,
                    kich_co_id: row.kich_co_id,
                    kich_co: row.so_kich_co,
                    so_luong_ton_kho: row.so_luong_ton_kho
                });
            }
            catch (error) {
                console.error('Error checking existence of Bien The SP:', error);
                throw error;
            }
        });
    }
    static updateSoLuongTonKho(id, so_luong_moi) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query(`UPDATE bien_the_san_pham SET so_luong_ton_kho = $1 WHERE id = $2`, [so_luong_moi, id]);
                return result.rowCount > 0;
            }
            catch (error) {
                console.error('Lỗi khi cập nhật số lượng tồn kho:', error);
                throw error;
            }
        });
    }
    static deleteBienThe(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query(`DELETE FROM bien_the_san_pham WHERE id = $1`, [id]);
                return result.rowCount > 0;
            }
            catch (error) {
                console.error('Lỗi khi xóa biến thể:', error);
                throw error;
            }
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query(`
                SELECT b.*, ms.ten_mau, ms.ma_mau, kc.so_kich_co 
                FROM bien_the_san_pham b
                JOIN mau_sac ms ON b.mau_sac_id = ms.id
                JOIN kich_co kc ON b.kich_co_id = kc.id
                WHERE b.id = $1
            `, [id]);
                if (result.rows.length === 0)
                    return null;
                const row = result.rows[0];
                return new BienTheSPModel_1.BienTheSPModel({
                    id: row.id,
                    san_pham_id: row.san_pham_id,
                    mau_sac_id: row.mau_sac_id,
                    mau_sac: row.ten_mau,
                    ma_mau: row.ma_mau,
                    kich_co_id: row.kich_co_id,
                    kich_co: row.so_kich_co,
                    so_luong_ton_kho: row.so_luong_ton_kho
                });
            }
            catch (error) {
                console.error('Lỗi khi lấy biến thể theo ID:', error);
                throw error;
            }
        });
    }
    static getByProductId(sanPhamId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_1.default.query(`
                SELECT b.*, ms.ten_mau, ms.ma_mau, kc.so_kich_co 
                FROM bien_the_san_pham b
                JOIN mau_sac ms ON b.mau_sac_id = ms.id
                JOIN kich_co kc ON b.kich_co_id = kc.id
                WHERE b.san_pham_id = $1
            `, [sanPhamId]);
                return result.rows.map(row => new BienTheSPModel_1.BienTheSPModel({
                    id: row.id,
                    san_pham_id: row.san_pham_id,
                    mau_sac_id: row.mau_sac_id,
                    mau_sac: row.ten_mau,
                    ma_mau: row.ma_mau,
                    kich_co_id: row.kich_co_id,
                    kich_co: row.so_kich_co,
                    so_luong_ton_kho: row.so_luong_ton_kho
                }));
            }
            catch (error) {
                console.error('Lỗi khi lấy danh sách biến thể theo sản phẩm ID:', error);
                throw error;
            }
        });
    }
    static createVariantByNames(sanPhamId, tenMau, soKichCo, soLuongTonKho) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Lấy màu_sắc_id
                const colorResult = yield db_1.default.query(`SELECT id FROM mau_sac WHERE ten_mau = $1`, [tenMau]);
                if (colorResult.rowCount === 0)
                    throw new Error(`Không tìm thấy màu: ${tenMau}`);
                const mauSacId = colorResult.rows[0].id;
                // Lấy kích_cỡ_id
                const sizeResult = yield db_1.default.query(`SELECT id FROM kich_co WHERE so_kich_co = $1`, [soKichCo]);
                if (sizeResult.rowCount === 0)
                    throw new Error(`Không tìm thấy kích cỡ: ${soKichCo}`);
                const kichCoId = sizeResult.rows[0].id;
                // Kiểm tra xem biến thể đã tồn tại chưa
                const exists = yield db_1.default.query(`SELECT 1 FROM bien_the_san_pham 
             WHERE san_pham_id = $1 AND mau_sac_id = $2 AND kich_co_id = $3`, [sanPhamId, mauSacId, kichCoId]);
                if (exists.rowCount > 0) {
                    console.log('Biến thể đã tồn tại. Không tạo mới.');
                    return;
                }
                // Tạo ID mới theo định dạng BTxxx
                const idResult = yield db_1.default.query(`
            SELECT MAX(CAST(SUBSTRING(id FROM 3) AS INTEGER)) AS max_id
            FROM bien_the_san_pham
            WHERE id ~ '^BT[0-9]+$'
        `);
                const maxId = idResult.rows[0].max_id || 0;
                const newIdNumber = maxId + 1;
                const newVariantId = `BT${newIdNumber.toString().padStart(3, '0')}`;
                // Chèn biến thể mới
                yield db_1.default.query(`INSERT INTO bien_the_san_pham (id, san_pham_id, mau_sac_id, kich_co_id, so_luong_ton_kho)
             VALUES ($1, $2, $3, $4, $5)`, [newVariantId, sanPhamId, mauSacId, kichCoId, soLuongTonKho]);
                console.log(`Đã tạo biến thể mới: ${newVariantId}`);
            }
            catch (error) {
                console.error('Lỗi khi tạo biến thể sản phẩm:', error);
                throw error;
            }
        });
    }
}
exports.BienTheService = BienTheService;
