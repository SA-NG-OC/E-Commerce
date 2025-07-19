import pool from '../config/db';
import { DanhGiaSPModel } from '../models/DanhGiaSPModel';

export class DanhGiaSPService {
    static async update(id: number, noi_dung_danh_gia: string, diem_danh_gia: number): Promise<DanhGiaSPModel | null> {
        const result = await pool.query(`
            UPDATE danh_gia_san_pham
            SET noi_dung_danh_gia = $1, diem_danh_gia = $2
            WHERE id = $3
            RETURNING *
        `, [noi_dung_danh_gia, diem_danh_gia, id]);
        const row = result.rows[0];
        if (!row) return null;
        // Lấy họ tên người dùng
        let hoTenNguoiDung: string | undefined = undefined;
        if (row.nguoi_dung_id) {
            const userRes = await pool.query('SELECT ho, ten FROM nguoi_dung WHERE id = $1', [row.nguoi_dung_id]);
            if (userRes.rows.length > 0) {
                hoTenNguoiDung = `${userRes.rows[0].ho?.trim() || ''} ${userRes.rows[0].ten?.trim() || ''}`.trim();
            }
        }
        return new DanhGiaSPModel({
            id: row.id,
            san_pham_id: row.san_pham_id,
            nguoi_dung_id: row.nguoi_dung_id,
            diem_danh_gia: row.diem_danh_gia,
            noi_dung_danh_gia: row.noi_dung_danh_gia,
            ngay_tao: row.ngay_tao,
            ho_ten_nguoi_dung: hoTenNguoiDung
        });
    }
    static async getBySanPhamId(san_pham_id: number): Promise<DanhGiaSPModel[]> {
        const result = await pool.query(`
            SELECT dg.*, CONCAT(nd.ho, ' ', nd.ten) AS ho_ten_nguoi_dung
            FROM danh_gia_san_pham dg
            JOIN nguoi_dung nd ON dg.nguoi_dung_id = nd.id
            WHERE dg.san_pham_id = $1
            ORDER BY dg.ngay_tao DESC
        `, [san_pham_id]);

        return result.rows.map(row => new DanhGiaSPModel({
            id: row.id,
            san_pham_id: row.san_pham_id,
            nguoi_dung_id: row.nguoi_dung_id,
            diem_danh_gia: row.diem_danh_gia,
            noi_dung_danh_gia: row.noi_dung_danh_gia,
            ngay_tao: row.ngay_tao,
            ho_ten_nguoi_dung: row.ho_ten_nguoi_dung?.trim() || undefined
        }));
    }

    static async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM danh_gia_san_pham WHERE id = $1', [id]);
        return !!result.rowCount && result.rowCount > 0;
    }

    static async create(danhGia: DanhGiaSPModel): Promise<DanhGiaSPModel> {
        // Lấy id mới
        const maxIdRes = await pool.query('SELECT MAX(id) AS max_id FROM danh_gia_san_pham');
        const newId = (maxIdRes.rows[0].max_id || 0) + 1;
        const result = await pool.query(`
            INSERT INTO danh_gia_san_pham (id, san_pham_id, nguoi_dung_id, diem_danh_gia, noi_dung_danh_gia, ngay_tao)
            VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *
        `, [
            newId,
            danhGia.san_pham_id,
            danhGia.nguoi_dung_id,
            danhGia.diem_danh_gia,
            danhGia.noi_dung_danh_gia
        ]);
        const row = result.rows[0];
        // Lấy họ tên người dùng
        let hoTenNguoiDung: string | undefined = undefined;
        if (row.nguoi_dung_id) {
            const userRes = await pool.query('SELECT ho, ten FROM nguoi_dung WHERE id = $1', [row.nguoi_dung_id]);
            if (userRes.rows.length > 0) {
                hoTenNguoiDung = `${userRes.rows[0].ho?.trim() || ''} ${userRes.rows[0].ten?.trim() || ''}`.trim();
            }
        }
        return new DanhGiaSPModel({
            id: row.id,
            san_pham_id: row.san_pham_id,
            nguoi_dung_id: row.nguoi_dung_id,
            diem_danh_gia: row.diem_danh_gia,
            noi_dung_danh_gia: row.noi_dung_danh_gia,
            ngay_tao: row.ngay_tao,
            ho_ten_nguoi_dung: hoTenNguoiDung
        });
    }
}
