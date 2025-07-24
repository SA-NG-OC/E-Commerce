import pool from '../config/db';
import { SanPham } from '../models/SanPhamModel';
import { HinhAnhSPModel } from '../models/HinhAnhSPModel';
import { BienTheSPModel } from '../models/BienTheSPModel';

export class SanPhamService {
    // Lấy 1 sản phẩm theo id (bao gồm danh sách hình ảnh và biến thể)
    static async getById(id: string | number): Promise<SanPham | null> {
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

        // Lấy hình ảnh (gắn với từng màu sắc)
        const imgResult = await pool.query(`
            SELECT * FROM hinh_anh_san_pham 
            WHERE san_pham_id = $1
            ORDER BY id ASC
        `, [id]);

        const danh_sach_hinh_anh = imgResult.rows.map(img => new HinhAnhSPModel({
            id: img.id,
            san_pham_id: img.san_pham_id,
            mau_sac_id: img.mau_sac_id,
            duong_dan_hinh_anh: img.duong_dan_hinh_anh
        }));

        // Lấy danh sách biến thể
        const bienTheResult = await pool.query(`
            SELECT * FROM bien_the_san_pham 
            WHERE san_pham_id = $1
        `, [id]);

        const danh_sach_bien_the = bienTheResult.rows.map(bienThe => new BienTheSPModel({
            id: bienThe.id,
            san_pham_id: bienThe.san_pham_id,
            mau_sac_id: bienThe.mau_sac_id,
            kich_co_id: bienThe.kich_co_id,
            so_luong_ton_kho: bienThe.so_luong_ton_kho
        }));

        return new SanPham({
            id: row.id,
            ten_san_pham: row.ten_san_pham,
            ma_san_pham: row.ma_san_pham,
            gia_ban: row.gia_ban,
            mo_ta: row.mo_ta ?? '',
            danh_muc: row.ten_danh_muc ?? '',
            thuong_hieu: row.ten_thuong_hieu ?? '',
            danh_sach_bien_the,
            danh_sach_hinh_anh
        });
    }

    // Lấy toàn bộ sản phẩm (hiển thị ảnh đại diện đầu tiên)
    static async getAllWithImages(): Promise<SanPham[]> {
        const result = await pool.query(`
            SELECT sp.*, 
                   dm.ten_danh_muc AS ten_danh_muc, 
                   th.ten_thuong_hieu AS ten_thuong_hieu,
                   ha.id as ha_id, ha.mau_sac_id, ha.duong_dan_hinh_anh
            FROM san_pham sp
            LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
            LEFT JOIN thuong_hieu th ON sp.thuong_hieu_id = th.id
            LEFT JOIN LATERAL (
                SELECT * FROM hinh_anh_san_pham 
                WHERE san_pham_id = sp.id 
                ORDER BY id ASC 
                LIMIT 1
            ) ha ON true
        `);

        return result.rows.map(row => {
            const hinhAnh = row.ha_id
                ? [new HinhAnhSPModel({
                    id: row.ha_id,
                    san_pham_id: row.id,
                    mau_sac_id: row.mau_sac_id,
                    duong_dan_hinh_anh: row.duong_dan_hinh_anh
                })]
                : [];

            return new SanPham({
                id: row.id,
                ten_san_pham: row.ten_san_pham,
                ma_san_pham: row.ma_san_pham,
                gia_ban: row.gia_ban,
                mo_ta: row.mo_ta,
                danh_muc: row.ten_danh_muc ?? null,
                thuong_hieu: row.ten_thuong_hieu ?? null,
                danh_sach_hinh_anh: hinhAnh,
                danh_sach_bien_the: [] // Không load biến thể ở danh sách
            });
        });
    }
}
