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
exports.DanhGiaSPController = void 0;
const DanhGiaSPService_1 = require("../services/DanhGiaSPService");
const DanhGiaSPModel_1 = require("../models/DanhGiaSPModel");
class DanhGiaSPController {
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewId = req.params.id;
                const { noi_dung_danh_gia, diem_danh_gia } = req.body;
                const updatedReview = yield DanhGiaSPService_1.DanhGiaSPService.update(reviewId, noi_dung_danh_gia, diem_danh_gia);
                if (updatedReview) {
                    res.status(200).json(updatedReview);
                }
                else {
                    res.status(404).json({ message: 'Không tìm thấy đánh giá để cập nhật!' });
                }
            }
            catch (err) {
                console.error('Lỗi khi cập nhật đánh giá:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static getBySanPhamId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sanPhamId = req.params.san_pham_id;
                const reviews = yield DanhGiaSPService_1.DanhGiaSPService.getBySanPhamId(sanPhamId);
                res.json(reviews);
            }
            catch (err) {
                console.error('Lỗi khi tải review:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const danhGia = new DanhGiaSPModel_1.DanhGiaSPModel(req.body);
                const newId = yield DanhGiaSPService_1.DanhGiaSPService.generateNewId();
                danhGia.id = newId;
                const createdReview = yield DanhGiaSPService_1.DanhGiaSPService.create(danhGia);
                res.status(201).json(createdReview);
            }
            catch (err) {
                console.error('Lỗi khi tạo đánh giá:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewId = req.params.id;
                const deleted = yield DanhGiaSPService_1.DanhGiaSPService.delete(reviewId);
                if (deleted) {
                    res.status(200).json({ message: 'Xóa đánh giá thành công!' });
                }
                else {
                    res.status(404).json({ message: 'Không tìm thấy đánh giá để xóa!' });
                }
            }
            catch (err) {
                console.error('Lỗi khi xóa đánh giá:', err);
                res.status(500).json({ message: 'Server error' });
            }
        });
    }
}
exports.DanhGiaSPController = DanhGiaSPController;
