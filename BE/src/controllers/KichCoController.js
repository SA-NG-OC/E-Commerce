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
exports.KichCoController = void 0;
const KichCoService_1 = require("../services/KichCoService");
// Sử dụng api http://localhost:3000/api/kich-co/
class KichCoController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const kichCos = yield KichCoService_1.KichCoService.getAll();
                res.json(kichCos);
            }
            catch (err) {
                res.status(500).json({ message: 'Lỗi server' });
            }
        });
    }
    static getSizesBySanPhamId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanPhamId = req.params.sanPhamId;
            try {
                const kichCos = yield KichCoService_1.KichCoService.getSizesBySanPhamId(sanPhamId);
                if (kichCos) {
                    res.json(kichCos);
                }
                else {
                    res.status(404).json({ message: 'Không tìm thấy kích cỡ cho sản phẩm này' });
                }
            }
            catch (err) {
                res.status(500).json({ message: 'Lỗi server' });
            }
        });
    }
}
exports.KichCoController = KichCoController;
