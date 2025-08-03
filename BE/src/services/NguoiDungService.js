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
exports.NguoiDungService = void 0;
const db_1 = __importDefault(require("../config/db"));
const NguoiDungModel_1 = require("../models/NguoiDungModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class NguoiDungService {
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query('SELECT * FROM nguoi_dung WHERE email = $1', [email]);
            const row = result.rows[0];
            if (!row)
                return null;
            return new NguoiDungModel_1.NguoiDungModel({
                id: row.id,
                email: row.email,
                mat_khau_hash: row.mat_khau_hash,
                ho: row.ho,
                ten: row.ten,
                so_dien_thoai: row.so_dien_thoai,
                dia_chi: row.dia_chi,
                ngay_sinh: row.ngay_sinh,
                role_id: row.role_id
            });
        });
    }
    static login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findByEmail(email);
            if (!user)
                return null;
            const match = yield bcryptjs_1.default.compare(password, user.mat_khau_hash);
            if (!match)
                return null;
            return user;
        });
    }
}
exports.NguoiDungService = NguoiDungService;
