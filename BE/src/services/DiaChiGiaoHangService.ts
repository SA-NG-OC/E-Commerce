import pool from '../config/db';
import { DiaChiGiaoHangModel } from '../models/DiaChiGiaoHangModel';

export class DiaChiGiaoHangService {
    static async create(data: Omit<DiaChiGiaoHangModel, 'id'>): Promise<DiaChiGiaoHangModel> {
        const client = await pool.connect();

        try {
            // Lấy ID lớn nhất hiện có
            const { rows } = await client.query(`SELECT id FROM dia_chi_giao_hang ORDER BY id DESC LIMIT 1`);
            let newId = 'DC001';
            if (rows.length > 0) {
                const lastId: string = rows[0].id; // e.g., 'DC007'
                const lastNumber = parseInt(lastId.replace('DC', ''), 10);
                const nextNumber = lastNumber + 1;
                newId = 'DC' + nextNumber.toString().padStart(3, '0');
            }

            // Insert vào DB
            const insertQuery = `
                INSERT INTO dia_chi_giao_hang (
                    id, don_hang_id, ho_ten_nguoi_nhan, so_dien_thoai,
                    dia_chi_chi_tiet, phuong_xa, tinh_thanh, ghi_chu
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING *;
            `;

            const values = [
                newId,
                data.don_hang_id,
                data.ho_ten_nguoi_nhan,
                data.so_dien_thoai,
                data.dia_chi_chi_tiet,
                data.phuong_xa,
                data.tinh_thanh,
                data.ghi_chu,
            ];

            const result = await client.query(insertQuery, values);
            const inserted = result.rows[0];

            return new DiaChiGiaoHangModel(inserted);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    static async findByDonHangId(donHangId: string): Promise<DiaChiGiaoHangModel | null> {
        const client = await pool.connect();
        try {
            const res = await client.query(
                `SELECT * FROM dia_chi_giao_hang WHERE don_hang_id = $1 LIMIT 1`,
                [donHangId]
            );
            if (res.rowCount === 0) return null;

            const row = res.rows[0];
            return new DiaChiGiaoHangModel({
                id: row.id,
                don_hang_id: row.don_hang_id,
                ho_ten_nguoi_nhan: row.ho_ten_nguoi_nhan,
                so_dien_thoai: row.so_dien_thoai,
                dia_chi_chi_tiet: row.dia_chi_chi_tiet,
                phuong_xa: row.phuong_xa,
                tinh_thanh: row.tinh_thanh,
                ghi_chu: row.ghi_chu
            });
        } catch (err) {
            console.error('Lỗi khi lấy địa chỉ giao hàng:', err);
            return null;
        } finally {
            client.release();
        }
    }

    static async update(addressId: string, data: Partial<DiaChiGiaoHangModel>): Promise<DiaChiGiaoHangModel | null> {
        const client = await pool.connect();
        try {
            const updateQuery = `
                UPDATE dia_chi_giao_hang
                SET 
                    ho_ten_nguoi_nhan = $1,
                    so_dien_thoai = $2,
                    dia_chi_chi_tiet = $3,
                    phuong_xa = $4,
                    tinh_thanh = $5,
                    ghi_chu = $6
                WHERE id = $7
                RETURNING *;
            `;

            const values = [
                data.ho_ten_nguoi_nhan,
                data.so_dien_thoai,
                data.dia_chi_chi_tiet,
                data.phuong_xa,
                data.tinh_thanh,
                data.ghi_chu,
                addressId
            ];

            const result = await client.query(updateQuery, values);
            if (result.rowCount === 0) return null;

            return new DiaChiGiaoHangModel(result.rows[0]);
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }
}
