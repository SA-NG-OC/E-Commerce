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
exports.ThuongHieuService = void 0;
const db_1 = __importDefault(require("../config/db"));
const ThuongHieuModel_1 = require("../models/ThuongHieuModel");
const SanPhamModel_1 = require("../models/SanPhamModel");
const HinhAnhSPModel_1 = require("../models/HinhAnhSPModel");
class ThuongHieuService {
    // Lấy tất cả thương hiệu kèm sản phẩm (ảnh đại diện đầu tiên)
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const thuongHieuResult = yield db_1.default.query(`SELECT * FROM thuong_hieu ORDER BY ten_thuong_hieu`);
            const thuongHieuList = [];
            for (const th of thuongHieuResult.rows) {
                const sanPhamResult = yield db_1.default.query(`
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
                    ORDER BY id ASC LIMIT 1
                ) ha ON true
                WHERE sp.thuong_hieu_id = $1
            `, [th.id]);
                const san_phams = sanPhamResult.rows.map(row => {
                    var _a, _b;
                    const hinh_anh = row.ha_id
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
                        danh_sach_hinh_anh: hinh_anh,
                        danh_sach_bien_the: []
                    });
                });
                thuongHieuList.push(new ThuongHieuModel_1.ThuongHieuModel({
                    id: th.id,
                    ten_thuong_hieu: th.ten_thuong_hieu,
                    san_phams
                }));
            }
            return thuongHieuList;
        });
    }
}
exports.ThuongHieuService = ThuongHieuService;
