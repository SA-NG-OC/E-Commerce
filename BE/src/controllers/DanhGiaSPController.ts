import { Request, Response } from 'express';
import { DanhGiaSPService } from '../services/DanhGiaSPService';
import { DanhGiaSPModel } from '../models/DanhGiaSPModel';

export class DanhGiaSPController {
    static async update(req: Request, res: Response) {
        try {
            const reviewId = Number(req.params.id);
            const { noi_dung_danh_gia, diem_danh_gia } = req.body;
            const updatedReview = await DanhGiaSPService.update(reviewId, noi_dung_danh_gia, diem_danh_gia);
            if (updatedReview) {
                res.status(200).json(updatedReview);
            } else {
                res.status(404).json({ message: 'Không tìm thấy đánh giá để cập nhật!' });
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật đánh giá:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
    static async getBySanPhamId(req: Request, res: Response) {
        try {
            const reviews = await DanhGiaSPService.getBySanPhamId(Number(req.params.san_pham_id));
            res.json(reviews);
        } catch (err) {
            console.error('Lỗi khi tải review:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async create(req: Request, res: Response) {
        try {
            const danhGia = new DanhGiaSPModel(req.body);
            const createdReview = await DanhGiaSPService.create(danhGia);
            res.status(201).json(createdReview);
        } catch (err) {
            console.error('Lỗi khi tạo đánh giá:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const reviewId = Number(req.params.id);
            const deleted = await DanhGiaSPService.delete(reviewId);
            if (deleted) {
                res.status(200).json({ message: 'Xóa đánh giá thành công!' });
            } else {
                res.status(404).json({ message: 'Không tìm thấy đánh giá để xóa!' });
            }
        } catch (err) {
            console.error('Lỗi khi xóa đánh giá:', err);
            res.status(500).json({ message: 'Server error' });
        }
    }
}