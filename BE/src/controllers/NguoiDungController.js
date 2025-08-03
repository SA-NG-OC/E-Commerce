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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NguoiDungController = void 0;
const NguoiDungService_1 = require("../services/NguoiDungService");
class NguoiDungController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
            const user = yield NguoiDungService_1.NguoiDungService.login(email, password);
            if (!user)
                return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
            // Không trả về hash/mật khẩu
            const _a = user, { mat_khau_hash } = _a, userData = __rest(_a, ["mat_khau_hash"]);
            res.json({ user: userData });
        });
    }
}
exports.NguoiDungController = NguoiDungController;
