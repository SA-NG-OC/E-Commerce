import { MauSacModel } from "../models/MauSacModel";
import pool from '../config/db';

export class MauSacService {
    static async getAll(): Promise<MauSacModel[]> {
        const result = await pool.query(`SELECT * FROM mau_sac ORDER BY ten_mau`);
        const mauSacList: MauSacModel[] = [];

        for (const row of result.rows) {
            mauSacList.push(new MauSacModel(row.id, row.ten_mau, row.ma_mau));
        }

        return mauSacList;
    }

    static async getColorsBySanPhamId(sanPhamId: string): Promise<MauSacModel[] | null> {
        const query = await pool.query(`
        SELECT DISTINCT ms.id, ms.ten_mau, ms.ma_mau
        FROM bien_the_san_pham bt
        JOIN mau_sac ms ON bt.mau_sac_id = ms.id
        WHERE bt.san_pham_id = $1
        ORDER BY ms.ten_mau
    `, [sanPhamId]);

        const rows = query.rows;
        if (rows.length === 0) return null;

        const mauSacList: MauSacModel[] = rows.map(row => new MauSacModel(
            row.id,
            row.ten_mau,
            row.ma_mau
        ));

        return mauSacList;
    }

}
