import pool from '../config/db';
import { NguoiDungModel } from '../models/NguoiDungModel';
import bcrypt from 'bcryptjs';

export class NguoiDungService {
    static async findByEmail(email: string): Promise<NguoiDungModel | null> {
        const result = await pool.query(
            `SELECT 
            nd.id,
            nd.email,
            nd.mat_khau_hash,
            nd.ho,
            nd.ten,
            nd.so_dien_thoai,
            nd.dia_chi,
            nd.ngay_sinh,
            vt.ten_vai_tro
        FROM nguoi_dung nd
        LEFT JOIN vai_tro vt ON nd.role_id = vt.id
        WHERE nd.email = $1`,
            [email]
        );

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
            role: row.ten_vai_tro // lưu tên vai trò
        });
    }

    static async countNguoiDung(): Promise<number> {
        const client = await pool.connect();
        try {
            const result = await client.query(`SELECT COUNT(*) AS total FROM nguoi_dung WHERE role_id = 'USER'`);
            return parseInt(result.rows[0].total, 10);
        } catch (err) {
            console.error('Lỗi khi đếm số người dùng:', err);
            return 0;
        } finally {
            client.release();
        }
    }

    static async login(email: string, password: string): Promise<NguoiDungModel | null> {
        const user = await this.findByEmail(email);
        if (!user) return null;
        const match = await bcrypt.compare(password, user.mat_khau_hash);
        if (!match) return null;
        return user;
    }

    static async getAll(): Promise<NguoiDungModel[]> {
        const result = await pool.query(
            `SELECT 
            nd.id,
            nd.email,
            nd.mat_khau_hash,
            nd.ho,
            nd.ten,
            nd.so_dien_thoai,
            nd.dia_chi,
            nd.ngay_sinh,
            vt.ten_vai_tro
        FROM nguoi_dung nd
        LEFT JOIN vai_tro vt ON nd.role_id = vt.id`
        );

        return result.rows.map(row => new NguoiDungModel({
            id: row.id,
            email: row.email,
            mat_khau_hash: row.mat_khau_hash,
            ho: row.ho,
            ten: row.ten,
            so_dien_thoai: row.so_dien_thoai,
            dia_chi: row.dia_chi,
            ngay_sinh: row.ngay_sinh,
            role: row.ten_vai_tro
        }));
    }

    static async update(user: {
        id: string;
        email: string;
        ho: string;
        ten: string;
        so_dien_thoai: string;
        dia_chi: string;
        ngay_sinh: string;
        role_id: string;
        mat_khau: string | null; // có thể null nếu không đổi mật khẩu
    }): Promise<void> {
        let query: string;
        let values: any[];

        if (user.mat_khau) {
            const hashedPassword = await bcrypt.hash(user.mat_khau, 10);
            query = `
            UPDATE nguoi_dung SET
                email = $1,
                ho = $2,
                ten = $3,
                so_dien_thoai = $4,
                dia_chi = $5,
                ngay_sinh = $6,
                role_id = $7,
                mat_khau_hash = $8
            WHERE id = $9
        `;
            values = [
                user.email,
                user.ho,
                user.ten,
                user.so_dien_thoai,
                user.dia_chi,
                user.ngay_sinh,
                user.role_id,
                hashedPassword,
                user.id
            ];
        } else {
            query = `
            UPDATE nguoi_dung SET
                email = $1,
                ho = $2,
                ten = $3,
                so_dien_thoai = $4,
                dia_chi = $5,
                ngay_sinh = $6,
                role_id = $7
            WHERE id = $8
        `;
            values = [
                user.email,
                user.ho,
                user.ten,
                user.so_dien_thoai,
                user.dia_chi,
                user.ngay_sinh,
                user.role_id,
                user.id
            ];
        }

        await pool.query(query, values);
    }



    static async create(user: NguoiDungModel): Promise<void> {
        // Lấy số thứ tự lớn nhất hiện tại cho người dùng
        const result = await pool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS INTEGER)) AS max_id FROM nguoi_dung`);
        const maxId = result.rows[0].max_id || 0;
        const newId = `ND${String(maxId + 1).padStart(3, '0')}`;

        const hashedPassword = await bcrypt.hash(user.mat_khau_hash, 10);

        // Tạo người dùng
        await pool.query(
            `INSERT INTO nguoi_dung (id, email, mat_khau_hash, ho, ten, so_dien_thoai, dia_chi, ngay_sinh, role_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                newId,
                user.email,
                hashedPassword,
                user.ho,
                user.ten,
                user.so_dien_thoai,
                user.dia_chi,
                user.ngay_sinh,
                user.role, // role_id
            ]
        );

        // Nếu là người dùng thường, tạo giỏ hàng
        if (user.role === 'USER') {
            const cartResult = await pool.query(`SELECT MAX(CAST(SUBSTRING(id, 3) AS INTEGER)) AS max_id FROM gio_hang`);
            const maxCartId = cartResult.rows[0].max_id || 0;
            const newCartId = `GH${String(maxCartId + 1).padStart(3, '0')}`;

            await pool.query(
                `INSERT INTO gio_hang (id, nguoi_dung_id) VALUES ($1, $2)`,
                [newCartId, newId]
            );
        }
    }

    static async deleteById(id: string): Promise<void> {
        await pool.query('DELETE FROM nguoi_dung WHERE id = $1', [id]);
    }


}
