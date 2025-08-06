import { Request, Response } from 'express';
import { DanhMucService } from '../services/DanhMucService';

export class DanhMucController {
    // GET http://localhost:3000/api/danh-muc
    static async getAll(req: Request, res: Response): Promise<void> {
        try {
            const danhMucs = await DanhMucService.getAll();
            res.status(200).json(danhMucs);
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }

    // PUT http://localhost:3000/api/danh-muc/:id
    static async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { ten_danh_muc, icon } = req.body;

        if (!ten_danh_muc || !icon) {
            res.status(400).json({ message: 'Thiếu thông tin tên danh mục hoặc icon' });
            return;
        }

        try {
            await DanhMucService.update(id, ten_danh_muc, icon);
            res.status(200).json({ message: 'Cập nhật danh mục thành công' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi khi cập nhật danh mục', error: err });
        }
    }

    //Sử dụng api: http://localhost:3000/api/danh-muc/
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const { icon, ten_danh_muc } = req.body;

            if (!icon || !ten_danh_muc) {
                res.status(400).json({ message: 'Thiếu icon hoặc tên danh mục' });
                return;
            }

            await DanhMucService.create(icon, ten_danh_muc);
            res.status(201).json({ message: 'Tạo danh mục thành công' });
        } catch (err) {
            res.status(500).json({ message: 'Lỗi server', error: err });
        }
    }

    // http://localhost:3000/api/danh-muc/:id
    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: 'Thiếu ID danh mục' });
                return;
            }

            await DanhMucService.delete(id);
            res.status(200).json({ message: 'Xóa danh mục thành công' });
        } catch (err: any) {
            if (err.code === '23503') {
                // PostgreSQL: lỗi ràng buộc khóa ngoại
                res.status(400).json({ message: 'Không thể xóa danh mục vì đang được sử dụng' });
            } else {
                res.status(500).json({ message: 'Lỗi server', error: err });
            }
        }
    }

}
