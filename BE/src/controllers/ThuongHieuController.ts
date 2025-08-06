import { Request, Response } from 'express';
import { ThuongHieuService } from '../services/ThuongHieuService';

export class ThuongHieuController {
    // GET http://localhost:3000/api/thuong-hieu
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const thuongHieus = await ThuongHieuService.getAll();
            res.status(200).json(thuongHieus);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }

    // PUT http://localhost:3000/api/thuong-hieu/:id
    static async updateName(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { ten_thuong_hieu } = req.body;

            if (!ten_thuong_hieu || !id) {
                res.status(400).json({ message: 'Thiếu ID hoặc tên thương hiệu' });
                return;
            }

            await ThuongHieuService.updateName(id, ten_thuong_hieu);
            res.status(200).json({ message: 'Cập nhật thành công' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }

    // Sử dụng post http://localhost:3000/api/thuong-hieu/
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { ten_thuong_hieu } = req.body;

            if (!ten_thuong_hieu) {
                res.status(400).json({ message: 'Thiếu tên thương hiệu' });
                return;
            }

            await ThuongHieuService.create(ten_thuong_hieu);
            res.status(201).json({ message: 'Tạo thương hiệu thành công' });
        } catch (err: any) {
            if (err.code === '23505') {
                // UNIQUE constraint violated
                res.status(409).json({ message: 'Tên thương hiệu đã tồn tại' });
            } else {
                res.status(500).json({ message: 'Lỗi server', error: err });
            }
        }
    }
    // sử dụng http://localhost:3000/api/thuong-hieu/:id
    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: 'Thiếu ID thương hiệu' });
                return;
            }

            await ThuongHieuService.delete(id);
            res.status(200).json({ message: 'Xóa thương hiệu thành công' });
        } catch (err: any) {
            if (err.code === '23503') {
                res.status(400).json({ message: 'Không thể xóa thương hiệu vì đang được sử dụng' });
            } else {
                res.status(500).json({ message: 'Lỗi server', error: err });
            }
        }
    }


}
