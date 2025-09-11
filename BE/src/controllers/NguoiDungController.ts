import { Request, Response } from 'express';
import { NguoiDungService } from '../services/NguoiDungService';
import { NguoiDungModel } from '../models/NguoiDungModel';
import jwt from "jsonwebtoken";

export class NguoiDungController {

    static async sendOTP(req: Request, res: Response) {
        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({ message: 'Email là bắt buộc' });
            }

            const success = await NguoiDungService.sendOTP(email);

            if (success) {
                res.json({ message: 'OTP đã được gửi đến email của bạn' });
            } else {
                res.status(404).json({ message: 'Email không tồn tại' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
            console.log("📩 Request body:", req.body);
            console.error("❌ Lỗi resetPassword:", error);
        }
    }

    // Xác thực OTP
    static async verifyOTP(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;

            if (!email || !otp) {
                return res.status(400).json({ message: 'Email và OTP là bắt buộc' });
            }

            const isValid = await NguoiDungService.verifyOTP(email, otp);

            if (isValid) {
                res.json({ message: 'OTP hợp lệ' });
            } else {
                res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // Đặt lại mật khẩu
    static async resetPassword(req: Request, res: Response) {
        try {
            const { email, otp, newPassword } = req.body;

            if (!email || !otp || !newPassword) {
                return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
            }

            const success = await NguoiDungService.resetPassword(email, otp, newPassword);

            if (success) {
                res.json({ message: 'Mật khẩu đã được đặt lại thành công' });
            } else {
                res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' });
        }
    }

    // Sử dụng http://localhost:3000/api/nguoi-dung/login
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
        }

        const user = await NguoiDungService.login(email, password);
        if (!user) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        // Bỏ mật khẩu trước khi trả về
        const { _mat_khau_hash, ...userData } = user as any;

        // Tạo JWT token
        const token = jwt.sign(
            {
                id: userData.id ?? userData._id,
                email: userData.email ?? userData._email,
                role: userData.role ?? userData._role,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        // Trả về user + token
        return res.json({ user: userData, token });
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
