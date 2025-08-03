import pool from '../config/db';
import { ThanhToanSPModel } from '../models/ThanhToanSPModel';

export async function getThanhToanSP(bienTheId: string, soLuong: number): Promise<ThanhToanSPModel | null> {
    const query = `
        SELECT 
            bt.id AS bien_the_id,
            sp.ten_san_pham,
            $2::int AS so_luong,
            sp.gia_ban AS don_gia,
            ms.ten_mau AS mau_sac,
            kc.so_kich_co AS kich_co,
            ha.duong_dan_hinh_anh
        FROM bien_the_san_pham bt
        JOIN san_pham sp ON bt.san_pham_id = sp.id
        JOIN mau_sac ms ON bt.mau_sac_id = ms.id
        JOIN kich_co kc ON bt.kich_co_id = kc.id
        LEFT JOIN hinh_anh_san_pham ha 
            ON ha.san_pham_id = sp.id AND ha.mau_sac_id = ms.id
        WHERE bt.id = $1
        LIMIT 1
    `;

    const result = await pool.query(query, [bienTheId, soLuong]);

    if (result.rows.length === 0) return null;

    return new ThanhToanSPModel(result.rows[0]);
}
