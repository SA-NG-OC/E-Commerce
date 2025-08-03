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
exports.getThanhToanSPController = void 0;
const ThanhToanSPService_1 = require("../services/ThanhToanSPService");
//Sử dụng api: http://localhost:3000/api/thanh-toan/:bienTheId/:soLuong
const getThanhToanSPController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bienTheId = req.params.bienTheId;
        const soLuong = parseInt(req.params.soLuong);
        if (!bienTheId || isNaN(soLuong)) {
            return res.status(400).json({ message: 'Invalid input' });
        }
        const model = yield (0, ThanhToanSPService_1.getThanhToanSP)(bienTheId, soLuong);
        if (!model) {
            return res.status(404).json({ message: 'Không tìm thấy biến thể' });
        }
        res.status(200).json(model);
    }
    catch (err) {
        console.error('Error in getThanhToanSPController:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getThanhToanSPController = getThanhToanSPController;
