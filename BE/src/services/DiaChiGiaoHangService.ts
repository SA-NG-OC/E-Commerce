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
}
