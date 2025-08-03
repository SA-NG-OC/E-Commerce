import { KichCoModel } from "../models/KichCoModel";
import pool from '../config/db';

export class KichCoService {
    static async getAll(): Promise<KichCoModel[] | null> {
        const query = await pool.query(`SELECT * FROM kich_co ORDER BY so_kich_co`);
        const rows = query.rows;
        const kichCoList: KichCoModel[] = [];
        if (rows.length === 0) return null;
        for (const row of rows) {
            const kichCo: KichCoModel = new KichCoModel(
                row.id,
                row.so_kich_co
            );
            kichCoList.push(kichCo);
        }
        return kichCoList;
    }

    static async getSizesBySanPhamId(sanPhamId: string): Promise<KichCoModel[] | null> {
        const query = await pool.query(`
        SELECT DISTINCT ON (kc.id) kc.id, kc.so_kich_co
        FROM bien_the_san_pham bt
        JOIN kich_co kc ON bt.kich_co_id = kc.id
        WHERE bt.san_pham_id = $1 AND bt.da_xoa = FALSE
        ORDER BY kc.id, kc.so_kich_co::int
    `, [sanPhamId]);

        const rows = query.rows;
        if (rows.length === 0) return null;

        return rows.map(row => new KichCoModel(row.id, row.so_kich_co));
    }


}

