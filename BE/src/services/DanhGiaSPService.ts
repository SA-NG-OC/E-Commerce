import pool from '../config/db';
import { DanhGiaSPModel } from '../models/DanhGiaSPModel';

export class DanhGiaSPService {
    static async update(id: string, noi_dung_danh_gia: string, diem_danh_gia: number): Promise<DanhGiaSPModel | null> {
        const result = await pool.query(`
            UPDATE danh_gia_san_pham
            SET noi_dung_danh_gia = $1, diem_danh_gia = $2
            WHERE id = $3
            RETURNING *
        `, [noi_dung_danh_gia, diem_danh_gia, id]);

        const row = result.rows[0];
        if (!row) return null;

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

    static async getBySanPhamId(san_pham_id: string): Promise<DanhGiaSPModel[]> {
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

    static async delete(id: string): Promise<boolean> {
        const result = await pool.query('DELETE FROM danh_gia_san_pham WHERE id = $1', [id]);
        return !!result.rowCount && result.rowCount > 0;
    }

    static async create(danhGia: DanhGiaSPModel): Promise<DanhGiaSPModel> {
        const result = await pool.query(`
            INSERT INTO danh_gia_san_pham (id, san_pham_id, nguoi_dung_id, diem_danh_gia, noi_dung_danh_gia, ngay_tao)
            VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *
        `, [
            danhGia.id,
            danhGia.san_pham_id,
            danhGia.nguoi_dung_id,
            danhGia.diem_danh_gia,
            danhGia.noi_dung_danh_gia
        ]);

        const row = result.rows[0];

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

    static async generateNewId(): Promise<string> {
        const result = await pool.query(`
        SELECT id FROM danh_gia_san_pham 
        WHERE id LIKE 'DG%' 
        ORDER BY LENGTH(id) DESC, id DESC 
        LIMIT 1
    `);

        if (result.rows.length === 0) {
            return 'DG001';
        }

        const lastId = result.rows[0].id; // VD: "DG015"
        const numberPart = parseInt(lastId.replace('DG', ''), 10); // 15
        const newNumber = numberPart + 1;
        const newId = 'DG' + newNumber.toString().padStart(3, '0'); // => "DG016"
        return newId;
    }

}
