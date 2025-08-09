import { Request, Response } from 'express';
import { NguoiDungService } from '../services/NguoiDungService';
import { NguoiDungModel } from '../models/NguoiDungModel';

export class NguoiDungController {
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
        const user: NguoiDungModel | null = await NguoiDungService.login(email, password);
        if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        // Không trả về hash/mật khẩu
        const { mat_khau_hash, ...userData } = user as any;
        res.json({ user: userData });
    }

    //Sử dụng api: http://localhost:3000/api/nguoi-dung/
    static async getAll(req: Request, res: Response) {
        try {
            const users = await NguoiDungService.getAll();
            res.json(users);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
        }
    }

    //Sử dụng api: http://localhost:3000/api/nguoi-dung/update
    static async update(req: Request, res: Response) {
        try {
            const {
                id,
                email,
                ho,
                ten,
                so_dien_thoai,
                dia_chi,
                ngay_sinh,
                role_id,
                mat_khau // có thể undefined hoặc rỗng
            } = req.body;

            if (!id || !email || !ho || !ten || !role_id) {
                return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
            }

            await NguoiDungService.update({
                id,
                email,
                ho,
                ten,
                so_dien_thoai,
                dia_chi,
                ngay_sinh,
                role_id,
                mat_khau: mat_khau || null // truyền null nếu không có mật khẩu
            });

            res.json({ message: 'Cập nhật người dùng thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi khi cập nhật người dùng' });
        }
    }

    //Sử dụng: http://localhost:3000/api/nguoi-dung/create
    static async create(req: Request, res: Response) {
        try {
            const {
                email,
                mat_khau, // nhận mật khẩu từ client
                ho,
                ten,
                so_dien_thoai,
                dia_chi,
                ngay_sinh,
                role, // là role_id (VD: "VT001")
            } = req.body;

            const newUser = new NguoiDungModel({
                id: '', // sẽ được tự tạo trong service
                email,
                mat_khau_hash: mat_khau,
                ho,
                ten,
                so_dien_thoai,
                dia_chi,
                ngay_sinh,
                role,
            });

            await NguoiDungService.create(newUser);

            res.status(201).json({ message: 'Tạo người dùng thành công' });
        } catch (error) {
            console.error('Lỗi tạo người dùng:', error);
            res.status(500).json({ message: 'Lỗi máy chủ khi tạo người dùng' });
        }
    }

    //Sử dụng: http://localhost:3000/api/nguoi-dung/:id
    static async delete(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) return res.status(400).json({ message: 'Thiếu ID người dùng' });

            await NguoiDungService.deleteById(id);
            res.json({ message: 'Xóa người dùng thành công' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi khi xóa người dùng' });
        }
    }

    // http://localhost:3000/api/nguoi-dung/count
    static async countNguoiDung(req: Request, res: Response) {
        try {
            const total = await NguoiDungService.countNguoiDung();
            return res.status(200).json({ total });
        } catch (error) {
            console.error('Lỗi khi đếm số người dùng:', error);
            return res.status(500).json({ message: 'Lỗi server khi đếm số người dùng' });
        }
    }
}
