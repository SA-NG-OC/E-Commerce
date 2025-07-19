
import pool from '../config/db';
import { SanPham } from '../models/SanPhamModel';
import { HinhAnhSPModel } from '../models/HinhAnhSPModel';

export class SanPhamService {
    static async getById(id: string | number) {
        const result = await pool.query(`
            SELECT sp.*, 
                   dm.ten_danh_muc AS ten_danh_muc, 
                   th.ten_thuong_hieu AS ten_thuong_hieu
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
            LEFT JOIN thuong_hieu th ON sp.thuong_hieu_id = th.id
            WHERE sp.id = $1
            LIMIT 1
        `, [id]);
        const row = result.rows[0];
        if (!row) return null;
        // Lấy hình ảnh
        const imgResult = await pool.query('SELECT * FROM hinh_anh_san_pham WHERE san_pham_id = $1 ORDER BY id ASC', [id]);
        const hinhAnh = imgResult.rows.map(img => new HinhAnhSPModel(img.id, img.san_pham_id, img.duong_dan_hinh_anh));
        return new SanPham({
            id: row.id,
            ten_san_pham: row.ten_san_pham,
            ma_san_pham: row.ma_san_pham,
            gia_ban: row.gia_ban,
            mo_ta: row.mo_ta ?? '',
            so_luong_ton_kho: row.so_luong_ton_kho,
            danh_muc: row.ten_danh_muc ?? '',
            thuong_hieu: row.ten_thuong_hieu ?? '',
            danh_sach_hinh_anh: hinhAnh
        });
    }
    static async getAllWithImages(): Promise<SanPham[]> {
        const result = await pool.query(`
            SELECT sp.*, 
                   dm.ten_danh_muc AS ten_danh_muc, 
                   th.ten_thuong_hieu AS ten_thuong_hieu,
                   ha.id as ha_id, ha.duong_dan_hinh_anh
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
            LEFT JOIN thuong_hieu th ON sp.thuong_hieu_id = th.id
            LEFT JOIN LATERAL (
                SELECT * FROM hinh_anh_san_pham WHERE san_pham_id = sp.id ORDER BY id ASC LIMIT 1
            ) ha ON true
        `);

        return result.rows.map(row => {
            const hinhAnh = row.ha_id
                ? [new HinhAnhSPModel(row.ha_id, row.id, row.duong_dan_hinh_anh)]
                : [];
            return new SanPham({
                id: row.id,
                ten_san_pham: row.ten_san_pham,
                ma_san_pham: row.ma_san_pham,
                gia_ban: row.gia_ban,
                mo_ta: row.mo_ta,
                so_luong_ton_kho: row.so_luong_ton_kho,
                danh_muc: row.ten_danh_muc ?? null,
                thuong_hieu: row.ten_thuong_hieu ?? null,
                danh_sach_hinh_anh: hinhAnh
            });
        });
    }
}
