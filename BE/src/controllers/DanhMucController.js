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
exports.DanhMucController = void 0;
const DanhMucService_1 = require("../services/DanhMucService");
class DanhMucController {
    // GET http://localhost:3000/api/danh-muc
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const danhMucs = yield DanhMucService_1.DanhMucService.getAll();
                res.status(200).json(danhMucs);
            }
            catch (err) {
                res.status(500).json({ message: 'Lỗi server', error: err });
            }
        });
    }
}
exports.DanhMucController = DanhMucController;
