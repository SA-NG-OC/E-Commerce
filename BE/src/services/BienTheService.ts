import { BienTheSPModel } from "../models/BienTheSPModel";
import pool from "../config/db";

export class BienTheService {
    static async checkExist(id_mau: string, id_kich_co: string, id_san_pham: string): Promise<BienTheSPModel | null> {
        try {
            const query = await pool.query(`SELECT * FROM bien_the_san_pham WHERE mau_sac_id = $1 AND kich_co_id = $2 AND san_pham_id = $3`, [id_mau, id_kich_co, id_san_pham]);
            if (query.rows.length === 0) {
                return null;
            }
            const row = query.rows[0];
            return new BienTheSPModel({
                id: row.id,
                san_pham_id: row.san_pham_id,
                mau_sac_id: row.mau_sac_id,
                kich_co_id: row.kich_co_id,
                so_luong_ton_kho: row.so_luong_ton_kho,
            });

        } catch (error) {
            console.error('Error checking existence of Bien The SP:', error);
            throw error;
        }
    }
}