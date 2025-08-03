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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MauSacController = void 0;
const MauSacService_1 = require("../services/MauSacService");
//Sử dụng api http://localhost:3000/api/mau-sac/
class MauSacController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mauSacs = yield MauSacService_1.MauSacService.getAll();
                res.json(mauSacs);
            }
            catch (err) {
                console.error('Lỗi khi lấy danh sách màu sắc:', err);
                res.status(500).json({ message: 'Lỗi server' });
            }
        });
    }
    static getColorsBySanPhamId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanPhamId = req.params.sanPhamId;
            try {
                const mauSacs = yield MauSacService_1.MauSacService.getColorsBySanPhamId(sanPhamId);
                if (mauSacs) {
                    res.json(mauSacs);
                }
                else {
                    res.status(404).json({ message: 'Không tìm thấy màu sắc cho sản phẩm này' });
                }
            }
            catch (err) {
                console.error('Lỗi khi lấy màu sắc cho sản phẩm:', err);
                res.status(500).json({ message: 'Lỗi server' });
            }
        });
    }
}
exports.MauSacController = MauSacController;
