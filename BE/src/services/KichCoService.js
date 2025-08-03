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
exports.KichCoService = void 0;
const KichCoModel_1 = require("../models/KichCoModel");
const db_1 = __importDefault(require("../config/db"));
class KichCoService {
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield db_1.default.query(`SELECT * FROM kich_co ORDER BY so_kich_co`);
            const rows = query.rows;
            const kichCoList = [];
            if (rows.length === 0)
                return null;
            for (const row of rows) {
                const kichCo = new KichCoModel_1.KichCoModel(row.id, row.so_kich_co);
                kichCoList.push(kichCo);
            }
            return kichCoList;
        });
    }
    static getSizesBySanPhamId(sanPhamId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = yield db_1.default.query(`
        SELECT DISTINCT ON (kc.id) kc.id, kc.so_kich_co
        FROM bien_the_san_pham bt
        JOIN kich_co kc ON bt.kich_co_id = kc.id
        WHERE bt.san_pham_id = $1
        ORDER BY kc.id, kc.so_kich_co::int
    `, [sanPhamId]);
            const rows = query.rows;
            if (rows.length === 0)
                return null;
            return rows.map(row => new KichCoModel_1.KichCoModel(row.id, row.so_kich_co));
        });
    }
}
exports.KichCoService = KichCoService;
