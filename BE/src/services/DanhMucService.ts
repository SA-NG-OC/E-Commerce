import pool from '../config/db';
import { DanhMucModel } from '../models/DanhMucModel';
import { SanPham } from '../models/SanPhamModel';
import { HinhAnhSPModel } from '../models/HinhAnhSPModel';

export class DanhMucService {
    static async getAll(): Promise<DanhMucModel[]> {
        const danhMucResult = await pool.query(`SELECT * FROM danh_muc ORDER BY ten_danh_muc`);
        const danhMucList: DanhMucModel[] = [];

        for (const dm of danhMucResult.rows) {
            const sanPhamResult = await pool.query(`
                SELECT sp.*, 
                       dm.ten_danh_muc, 
                       th.ten_thuong_hieu,
                       ha.id as ha_id, ha.mau_sac_id, ha.duong_dan_hinh_anh
                FROM san_pham sp
                LEFT JOIN thuong_hieu th ON sp.thuong_hieu_id = th.id
                LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
                LEFT JOIN LATERAL (
                    SELECT * FROM hinh_anh_san_pham 
                    WHERE san_pham_id = sp.id 
                    ORDER BY id ASC LIMIT 1
                ) ha ON true
                WHERE sp.danh_muc_id = $1
            `, [dm.id]);

            const san_phams = sanPhamResult.rows.map(row => {
                const hinh_anh = row.ha_id
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
                    danh_sach_hinh_anh: hinh_anh,
                    danh_sach_bien_the: []
                });
            });

            danhMucList.push(new DanhMucModel(
                dm.id,
                dm.ten_danh_muc,
                dm.icon,
                san_phams
            ));
        }

        return danhMucList;
    }
}
