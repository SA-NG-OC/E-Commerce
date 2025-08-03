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
exports.HinhAnhSPService = void 0;
const HinhAnhSPModel_1 = require("../models/HinhAnhSPModel");
const db_1 = __importDefault(require("../config/db"));
class HinhAnhSPService {
    // Lấy danh sách ảnh theo sản phẩm
    static getByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'SELECT * FROM hinh_anh_san_pham WHERE san_pham_id = $1 ORDER BY id';
                const result = yield db_1.default.query(query, [productId]);
                return result.rows.map((row) => new HinhAnhSPModel_1.HinhAnhSPModel({
                    id: row.id,
                    san_pham_id: row.san_pham_id,
                    mau_sac_id: row.mau_sac_id,
                    duong_dan_hinh_anh: row.duong_dan_hinh_anh
                }));
            }
            catch (error) {
                console.error('Lỗi khi lấy ảnh sản phẩm:', error);
                throw error;
            }
        });
    }
    // Thêm ảnh mới
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = yield this.generateId();
                const query = `
                INSERT INTO hinh_anh_san_pham (id, san_pham_id, mau_sac_id, duong_dan_hinh_anh)
                VALUES ($1, $2, $3, $4)
            `;
                const result = yield db_1.default.query(query, [
                    id,
                    data.san_pham_id,
                    data.mau_sac_id,
                    data.duong_dan_hinh_anh
                ]);
                return result.rowCount > 0;
            }
            catch (error) {
                console.error('Lỗi khi thêm ảnh:', error);
                throw error;
            }
        });
    }
    // Xóa ảnh theo đường dẫn
    static delete(duongDan) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = 'DELETE FROM hinh_anh_san_pham WHERE duong_dan_hinh_anh = $1';
                const result = yield db_1.default.query(query, [duongDan]);
                return result.rowCount > 0;
            }
            catch (error) {
                console.error('Lỗi khi xóa ảnh:', error);
                throw error;
            }
        });
    }
    // Tạo ID tự động
    static generateId() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT COUNT(*) as count FROM hinh_anh_san_pham';
            const result = yield db_1.default.query(query);
            const count = parseInt(result.rows[0].count, 10) + 1;
            return `IMG${count.toString().padStart(7, '0')}`;
        });
    }
}
exports.HinhAnhSPService = HinhAnhSPService;
