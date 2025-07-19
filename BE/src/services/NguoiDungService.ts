import pool from '../config/db';
import { NguoiDungModel } from '../models/NguoiDungModel';
import bcrypt from 'bcryptjs';

export class NguoiDungService {
    static async findByEmail(email: string): Promise<NguoiDungModel | null> {
        const result = await pool.query('SELECT * FROM nguoi_dung WHERE email = $1', [email]);
        const row = result.rows[0];
        if (!row) return null;
        return new NguoiDungModel({
            id: row.id,
            email: row.email,
            mat_khau_hash: row.mat_khau_hash,
            ho: row.ho,
            ten: row.ten,
            so_dien_thoai: row.so_dien_thoai,
            dia_chi: row.dia_chi,
            ngay_sinh: row.ngay_sinh,
            role_id: row.role_id
        });
    }

    static async login(email: string, password: string): Promise<NguoiDungModel | null> {
        const user = await this.findByEmail(email);
        if (!user) return null;
        const match = await bcrypt.compare(password, user.mat_khau_hash);
        if (!match) return null;
        return user;
    }
}
