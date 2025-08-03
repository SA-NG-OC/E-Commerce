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
exports.getThanhToanSP = getThanhToanSP;
const db_1 = __importDefault(require("../config/db"));
const ThanhToanSPModel_1 = require("../models/ThanhToanSPModel");
function getThanhToanSP(bienTheId, soLuong) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = `
        SELECT 
            bt.id AS bien_the_id,
            sp.ten_san_pham,
            $2::int AS so_luong,
            sp.gia_ban AS don_gia,
            ms.ten_mau AS mau_sac,
            kc.so_kich_co AS kich_co,
            ha.duong_dan_hinh_anh
        FROM bien_the_san_pham bt
        JOIN san_pham sp ON bt.san_pham_id = sp.id
        JOIN mau_sac ms ON bt.mau_sac_id = ms.id
        JOIN kich_co kc ON bt.kich_co_id = kc.id
        LEFT JOIN hinh_anh_san_pham ha 
            ON ha.san_pham_id = sp.id AND ha.mau_sac_id = ms.id
        WHERE bt.id = $1
        LIMIT 1
    `;
        const result = yield db_1.default.query(query, [bienTheId, soLuong]);
        if (result.rows.length === 0)
            return null;
        return new ThanhToanSPModel_1.ThanhToanSPModel(result.rows[0]);
    });
}
