import { BienTheSPModel } from "../models/BienTheSPModel";
import pool from "../config/db";

export class BienTheService {
    static async checkExist(id_mau: string, id_kich_co: string, id_san_pham: string): Promise<BienTheSPModel | null> {
        try {
            const query = await pool.query(`
                SELECT b.*, ms.ten_mau, ms.ma_mau, kc.so_kich_co 
                FROM bien_the_san_pham b
                JOIN mau_sac ms ON b.mau_sac_id = ms.id
                JOIN kich_co kc ON b.kich_co_id = kc.id
                WHERE b.mau_sac_id = $1 AND b.kich_co_id = $2 AND b.san_pham_id = $3 AND b.da_xoa = FALSE
            `, [id_mau, id_kich_co, id_san_pham]);

            if (query.rows.length === 0) return null;

            const row = query.rows[0];
            return new BienTheSPModel({
                id: row.id,
                san_pham_id: row.san_pham_id,
                mau_sac_id: row.mau_sac_id,
                mau_sac: row.ten_mau,
                ma_mau: row.ma_mau,
                kich_co_id: row.kich_co_id,
                kich_co: row.so_kich_co,
                so_luong_ton_kho: row.so_luong_ton_kho
            });
        } catch (error) {
            console.error('Error checking existence of Bien The SP:', error);
            throw error;
        }
    }

    static async updateSoLuongTonKho(id: string, so_luong_moi: number): Promise<boolean> {
        try {
            const result = await pool.query(
                `UPDATE bien_the_san_pham SET so_luong_ton_kho = $1 WHERE id = $2`,
                [so_luong_moi, id]
            );
            return result.rowCount! > 0;
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng tồn kho:', error);
            throw error;
        }
    }

    static async deleteBienThe(id: string): Promise<boolean> {
        try {
            const result = await pool.query(
                `DELETE FROM bien_the_san_pham WHERE id = $1`,
                [id]
            );
            return result.rowCount! > 0;
        } catch (error) {
            console.error('Lỗi khi xóa biến thể:', error);
            throw error;
        }
    }

    static async deleteBienTheAo(id: string): Promise<boolean> {
        try {
            const result = await pool.query(
                `UPDATE bien_the_san_pham SET da_xoa = TRUE WHERE id = $1`,
                [id]
            );
            return result.rowCount! > 0;
        } catch (error) {
            console.error('Lỗi khi "xóa ảo" biến thể:', error);
            throw error;
        }
    }


    static async getById(id: string): Promise<BienTheSPModel | null> {
        try {
            const result = await pool.query(`
                SELECT b.*, ms.ten_mau, ms.ma_mau, kc.so_kich_co 
                FROM bien_the_san_pham b
                JOIN mau_sac ms ON b.mau_sac_id = ms.id
                JOIN kich_co kc ON b.kich_co_id = kc.id
                WHERE b.id = $1 AND b.da_xoa = FALSE
            `, [id]);

            if (result.rows.length === 0) return null;

            const row = result.rows[0];
            return new BienTheSPModel({
                id: row.id,
                san_pham_id: row.san_pham_id,
                mau_sac_id: row.mau_sac_id,
                mau_sac: row.ten_mau,
                ma_mau: row.ma_mau,
                kich_co_id: row.kich_co_id,
                kich_co: row.so_kich_co,
                so_luong_ton_kho: row.so_luong_ton_kho
            });
        } catch (error) {
            console.error('Lỗi khi lấy biến thể theo ID:', error);
            throw error;
        }
    }

    static async getByProductId(sanPhamId: string): Promise<BienTheSPModel[]> {
        try {
            const result = await pool.query(`
                SELECT b.*, ms.ten_mau, ms.ma_mau, kc.so_kich_co 
                FROM bien_the_san_pham b
                JOIN mau_sac ms ON b.mau_sac_id = ms.id
                JOIN kich_co kc ON b.kich_co_id = kc.id
                WHERE b.san_pham_id = $1 AND b.da_xoa = FALSE
            `, [sanPhamId]);

            return result.rows.map(row => new BienTheSPModel({
                id: row.id,
                san_pham_id: row.san_pham_id,
                mau_sac_id: row.mau_sac_id,
                mau_sac: row.ten_mau,
                ma_mau: row.ma_mau,
                kich_co_id: row.kich_co_id,
                kich_co: row.so_kich_co,
                so_luong_ton_kho: row.so_luong_ton_kho
            }));
        } catch (error) {
            console.error('Lỗi khi lấy danh sách biến thể theo sản phẩm ID:', error);
            throw error;
        }
    }

    static async createVariantByNames(
        sanPhamId: string,
        tenMau: string,
        soKichCo: string,
        soLuongTonKho: number
    ): Promise<void> {
        try {
            // Lấy màu_sắc_id
            const colorResult = await pool.query(
                `SELECT id FROM mau_sac WHERE ten_mau = $1`,
                [tenMau]
            );
            if (colorResult.rowCount === 0) throw new Error(`Không tìm thấy màu: ${tenMau}`);
            const mauSacId = colorResult.rows[0].id;

            // Lấy kích_cỡ_id
            const sizeResult = await pool.query(
                `SELECT id FROM kich_co WHERE so_kich_co = $1`,
                [soKichCo]
            );
            if (sizeResult.rowCount === 0) throw new Error(`Không tìm thấy kích cỡ: ${soKichCo}`);
            const kichCoId = sizeResult.rows[0].id;

            // Kiểm tra xem biến thể đã tồn tại chưa
            const exists = await pool.query(
                `SELECT 1 FROM bien_the_san_pham 
             WHERE san_pham_id = $1 AND mau_sac_id = $2 AND kich_co_id = $3`,
                [sanPhamId, mauSacId, kichCoId]
            );
            if (exists.rowCount! > 0) {
                console.log('Biến thể đã tồn tại. Không tạo mới.');
                return;
            }

            // Tạo ID mới theo định dạng BTxxx
            const idResult = await pool.query(`
            SELECT MAX(CAST(SUBSTRING(id FROM 3) AS INTEGER)) AS max_id
            FROM bien_the_san_pham
            WHERE id ~ '^BT[0-9]+$'
        `);
            const maxId = idResult.rows[0].max_id || 0;
            const newIdNumber = maxId + 1;
            const newVariantId = `BT${newIdNumber.toString().padStart(3, '0')}`;

            // Chèn biến thể mới
            await pool.query(
                `INSERT INTO bien_the_san_pham (id, san_pham_id, mau_sac_id, kich_co_id, so_luong_ton_kho)
             VALUES ($1, $2, $3, $4, $5)`,
                [newVariantId, sanPhamId, mauSacId, kichCoId, soLuongTonKho]
            );
            console.log(`Đã tạo biến thể mới: ${newVariantId}`);
        } catch (error) {
            console.error('Lỗi khi tạo biến thể sản phẩm:', error);
            throw error;
        }
    }

}
