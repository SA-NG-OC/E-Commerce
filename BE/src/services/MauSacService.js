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
exports.MauSacService = void 0;
const MauSacModel_1 = require("../models/MauSacModel");
const db_1 = __importDefault(require("../config/db"));
class MauSacService {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`SELECT * FROM mau_sac ORDER BY ten_mau`);
            const mauSacList = [];
            for (const row of result.rows) {
                mauSacList.push(new MauSacModel_1.MauSacModel(row.id, row.ten_mau, row.ma_mau));
            }
            return mauSacList;
        });
    }
    static getColorsBySanPhamId(sanPhamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield db_1.default.query(`
        SELECT DISTINCT ms.id, ms.ten_mau, ms.ma_mau
        FROM bien_the_san_pham bt
        JOIN mau_sac ms ON bt.mau_sac_id = ms.id
        WHERE bt.san_pham_id = $1
        ORDER BY ms.ten_mau
    `, [sanPhamId]);
            const rows = query.rows;
            if (rows.length === 0)
                return null;
            const mauSacList = rows.map(row => new MauSacModel_1.MauSacModel(row.id, row.ten_mau, row.ma_mau));
            return mauSacList;
        });
    }
}
exports.MauSacService = MauSacService;
