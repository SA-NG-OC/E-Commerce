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
exports.SanPhamService = void 0;
const db_1 = __importDefault(require("../config/db"));
const SanPhamModel_1 = require("../models/SanPhamModel");
const HinhAnhSPModel_1 = require("../models/HinhAnhSPModel");
const BienTheSPModel_1 = require("../models/BienTheSPModel");
class SanPhamService {
    // Lấy 1 sản phẩm theo id (bao gồm danh sách hình ảnh và biến thể)
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const result = yield db_1.default.query(`
            SELECT sp.*, 
                   dm.ten_danh_muc AS ten_danh_muc, 
                   th.ten_thuong_hieu AS ten_thuong_hieu
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
            LEFT JOIN thuong_hieu th ON sp.thuong_hieu_id = th.id
            WHERE sp.id = $1
            LIMIT 1
        `, [id]);
            const row = result.rows[0];
            if (!row)
                return null;
            // Lấy hình ảnh (gắn với từng màu sắc)
            const imgResult = yield db_1.default.query(`
            SELECT * FROM hinh_anh_san_pham 
            WHERE san_pham_id = $1
            ORDER BY id ASC
        `, [id]);
            const danh_sach_hinh_anh = imgResult.rows.map(img => new HinhAnhSPModel_1.HinhAnhSPModel({
                id: img.id,
                san_pham_id: img.san_pham_id,
                mau_sac_id: img.mau_sac_id,
                duong_dan_hinh_anh: img.duong_dan_hinh_anh
            }));
            // Lấy danh sách biến thể
            const bienTheResult = yield db_1.default.query(`
            SELECT * FROM bien_the_san_pham 
            WHERE san_pham_id = $1
        `, [id]);
            const danh_sach_bien_the = bienTheResult.rows.map(bienThe => new BienTheSPModel_1.BienTheSPModel({
                id: bienThe.id,
                san_pham_id: bienThe.san_pham_id,
                mau_sac_id: bienThe.mau_sac_id,
                mau_sac: bienThe.mau_sac,
                ma_mau: bienThe.ma_mau,
                kich_co: bienThe.kich_co,
                kich_co_id: bienThe.kich_co_id,
                so_luong_ton_kho: bienThe.so_luong_ton_kho
            }));
            return new SanPhamModel_1.SanPham({
                id: row.id,
                ten_san_pham: row.ten_san_pham,
                ma_san_pham: row.ma_san_pham,
                gia_ban: row.gia_ban,
                mo_ta: (_a = row.mo_ta) !== null && _a !== void 0 ? _a : '',
                danh_muc: (_b = row.ten_danh_muc) !== null && _b !== void 0 ? _b : '',
                thuong_hieu: (_c = row.ten_thuong_hieu) !== null && _c !== void 0 ? _c : '',
                danh_sach_bien_the,
                danh_sach_hinh_anh
            });
        });
    }
    // Lấy toàn bộ sản phẩm (hiển thị ảnh đại diện đầu tiên)
    static getAllWithImages() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
            SELECT sp.*, 
                   dm.ten_danh_muc AS ten_danh_muc, 
                   th.ten_thuong_hieu AS ten_thuong_hieu,
                   ha.id as ha_id, ha.mau_sac_id, ha.duong_dan_hinh_anh
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
            LEFT JOIN thuong_hieu th ON sp.thuong_hieu_id = th.id
            LEFT JOIN LATERAL (
                SELECT * FROM hinh_anh_san_pham 
                WHERE san_pham_id = sp.id 
                ORDER BY id ASC 
                LIMIT 1
            ) ha ON true
        `);
            return result.rows.map(row => {
                var _a, _b;
                const hinhAnh = row.ha_id
                    ? [new HinhAnhSPModel_1.HinhAnhSPModel({
                            id: row.ha_id,
                            san_pham_id: row.id,
                            mau_sac_id: row.mau_sac_id,
                            duong_dan_hinh_anh: row.duong_dan_hinh_anh
                        })]
                    : [];
                return new SanPhamModel_1.SanPham({
                    id: row.id,
                    ten_san_pham: row.ten_san_pham,
                    ma_san_pham: row.ma_san_pham,
                    gia_ban: row.gia_ban,
                    mo_ta: row.mo_ta,
                    danh_muc: (_a = row.ten_danh_muc) !== null && _a !== void 0 ? _a : null,
                    thuong_hieu: (_b = row.ten_thuong_hieu) !== null && _b !== void 0 ? _b : null,
                    danh_sach_hinh_anh: hinhAnh,
                    danh_sach_bien_the: [] // Không load biến thể ở danh sách
                });
            });
        });
    }
    // Lấy sản phẩm theo danh mục ID
    static getByDanhMucWithImages(danhMucId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
        SELECT sp.*,
                dm.ten_danh_muc AS ten_danh_muc,
                th.ten_thuong_hieu AS ten_thuong_hieu,
               ha.id as ha_id, ha.mau_sac_id, ha.duong_dan_hinh_anh
        FROM san_pham sp
        LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
        LEFT JOIN thuong_hieu th ON sp.thuong_hieu_id = th.id
        LEFT JOIN LATERAL (
            SELECT * FROM hinh_anh_san_pham 
            WHERE san_pham_id = sp.id 
            ORDER BY id ASC 
            LIMIT 1
        ) ha ON true
        WHERE sp.danh_muc_id = $1
    `, [danhMucId]);
            return result.rows.map(row => {
                var _a, _b;
                const hinhAnh = row.ha_id
                    ? [new HinhAnhSPModel_1.HinhAnhSPModel({
                            id: row.ha_id,
                            san_pham_id: row.id,
                            mau_sac_id: row.mau_sac_id,
                            duong_dan_hinh_anh: row.duong_dan_hinh_anh
                        })]
                    : [];
                return new SanPhamModel_1.SanPham({
                    id: row.id,
                    ten_san_pham: row.ten_san_pham,
                    ma_san_pham: row.ma_san_pham,
                    gia_ban: row.gia_ban,
                    mo_ta: row.mo_ta,
                    danh_muc: (_a = row.ten_danh_muc) !== null && _a !== void 0 ? _a : null,
                    thuong_hieu: (_b = row.ten_thuong_hieu) !== null && _b !== void 0 ? _b : null,
                    danh_sach_hinh_anh: hinhAnh,
                    danh_sach_bien_the: [] // Không load biến thể ở danh sách
                });
            });
        });
    }
    // Lấy sản phẩm theo thương hiệu ID
    static getByThuongHieuWithImages(thuongHieuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
        SELECT sp.*,
                dm.ten_danh_muc AS ten_danh_muc,
                th.ten_thuong_hieu AS ten_thuong_hieu,
               ha.id as ha_id, ha.mau_sac_id, ha.duong_dan_hinh_anh
        FROM san_pham sp
        LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
        LEFT JOIN thuong_hieu th ON sp.thuong_hieu_id = th.id
        LEFT JOIN LATERAL (
            SELECT * FROM hinh_anh_san_pham 
            WHERE san_pham_id = sp.id 
            ORDER BY id ASC 
            LIMIT 1
        ) ha ON true
        WHERE sp.thuong_hieu_id = $1
    `, [thuongHieuId]);
            return result.rows.map(row => {
                var _a, _b;
                const hinhAnh = row.ha_id
                    ? [new HinhAnhSPModel_1.HinhAnhSPModel({
                            id: row.ha_id,
                            san_pham_id: row.id,
                            mau_sac_id: row.mau_sac_id,
                            duong_dan_hinh_anh: row.duong_dan_hinh_anh
                        })]
                    : [];
                return new SanPhamModel_1.SanPham({
                    id: row.id,
                    ten_san_pham: row.ten_san_pham,
                    ma_san_pham: row.ma_san_pham,
                    gia_ban: row.gia_ban,
                    mo_ta: row.mo_ta,
                    danh_muc: (_a = row.ten_danh_muc) !== null && _a !== void 0 ? _a : null,
                    thuong_hieu: (_b = row.ten_thuong_hieu) !== null && _b !== void 0 ? _b : null,
                    danh_sach_hinh_anh: hinhAnh,
                    danh_sach_bien_the: [] // Không load biến thể ở danh sách
                });
            });
        });
    }
    static filterByDanhMucAndThuongHieu(danhMucId, thuongHieuId) {
        return __awaiter(this, void 0, void 0, function* () {
            let conditions = [];
            let params = [];
            let index = 1;
            if (danhMucId) {
                conditions.push(`sp.danh_muc_id = $${index++}`);
                params.push(danhMucId);
            }
            if (thuongHieuId) {
                conditions.push(`sp.thuong_hieu_id = $${index++}`);
                params.push(thuongHieuId);
            }
            const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
            const result = yield db_1.default.query(`
        SELECT sp.*, 
               dm.ten_danh_muc, 
               th.ten_thuong_hieu,
               ha.id as ha_id, ha.mau_sac_id, ha.duong_dan_hinh_anh
        FROM san_pham sp
        LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
        LEFT JOIN thuong_hieu th ON sp.thuong_hieu_id = th.id
        LEFT JOIN LATERAL (
            SELECT * FROM hinh_anh_san_pham 
            WHERE san_pham_id = sp.id 
            ORDER BY id ASC 
            LIMIT 1
        ) ha ON true
        ${whereClause}
    `, params);
            return result.rows.map(row => {
                var _a, _b;
                const hinhAnh = row.ha_id
                    ? [new HinhAnhSPModel_1.HinhAnhSPModel({
                            id: row.ha_id,
                            san_pham_id: row.id,
                            mau_sac_id: row.mau_sac_id,
                            duong_dan_hinh_anh: row.duong_dan_hinh_anh
                        })]
                    : [];
                return new SanPhamModel_1.SanPham({
                    id: row.id,
                    ten_san_pham: row.ten_san_pham,
                    ma_san_pham: row.ma_san_pham,
                    gia_ban: row.gia_ban,
                    mo_ta: row.mo_ta,
                    danh_muc: (_a = row.ten_danh_muc) !== null && _a !== void 0 ? _a : null,
                    thuong_hieu: (_b = row.ten_thuong_hieu) !== null && _b !== void 0 ? _b : null,
                    danh_sach_hinh_anh: hinhAnh,
                    danh_sach_bien_the: []
                });
            });
        });
    }
    static updateSanPham(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Truy vấn lấy ID danh mục
            const dmResult = yield db_1.default.query(`SELECT id FROM danh_muc WHERE ten_danh_muc = $1 LIMIT 1`, [data.ten_danh_muc]);
            if (dmResult.rows.length === 0)
                throw new Error('Không tìm thấy danh mục');
            const danh_muc_id = dmResult.rows[0].id;
            // Truy vấn lấy ID thương hiệu
            const thResult = yield db_1.default.query(`SELECT id FROM thuong_hieu WHERE ten_thuong_hieu = $1 LIMIT 1`, [data.ten_thuong_hieu]);
            if (thResult.rows.length === 0)
                throw new Error('Không tìm thấy thương hiệu');
            const thuong_hieu_id = thResult.rows[0].id;
            // Cập nhật sản phẩm
            const updateResult = yield db_1.default.query(`UPDATE san_pham 
         SET ten_san_pham = $1, 
             ma_san_pham = $2,
             mo_ta = $3,
             gia_ban = $4,
             danh_muc_id = $5,
             thuong_hieu_id = $6
         WHERE id = $7`, [
                data.ten_san_pham,
                data.ma_san_pham,
                data.mo_ta,
                data.gia_ban,
                danh_muc_id,
                thuong_hieu_id,
                id
            ]);
            if (updateResult.rowCount === 0)
                throw new Error('Cập nhật sản phẩm không thành công');
            return !(updateResult.rowCount === 0);
        });
    }
}
exports.SanPhamService = SanPhamService;
