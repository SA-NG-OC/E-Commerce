import { Request, Response } from 'express';
import { NguoiDungService } from '../services/NguoiDungService';

export class NguoiDungController {
    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
        const user = await NguoiDungService.login(email, password);
        if (!user) return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        // Không trả về hash/mật khẩu
        const { mat_khau_hash, ...userData } = user as any;
        res.json({ user: userData });
    }
}
