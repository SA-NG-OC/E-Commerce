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

    static async update(id: string, ten_danh_muc: string, icon: string): Promise<void> {
        await pool.query(
            `UPDATE danh_muc
         SET ten_danh_muc = $1,
             icon = $2
         WHERE id = $3`,
            [ten_danh_muc, icon, id]
        );
    }

    static async create(icon: string, ten_danh_muc: string): Promise<void> {
        // Lấy ID lớn nhất hiện có dạng 'DMxxx'
        const result = await pool.query(`
        SELECT id FROM danh_muc
        WHERE id ~ '^DM[0-9]{3}$'
        ORDER BY id DESC
        LIMIT 1
    `);

        let nextId: string;
        if (result.rows.length === 0) {
            nextId = 'DM001'; // Nếu chưa có bản ghi nào
        } else {
            const maxId = result.rows[0].id; // Ví dụ: 'DM017'
            const number = parseInt(maxId.slice(2), 10) + 1;
            nextId = 'DM' + number.toString().padStart(3, '0'); // Ví dụ: 'DM018'
        }

        // Thêm danh mục mới
        await pool.query(
            'INSERT INTO danh_muc (id, icon, ten_danh_muc) VALUES ($1, $2, $3)',
            [nextId, icon, ten_danh_muc]
        );
    }

    static async delete(id: string): Promise<void> {
        try {
            await pool.query(`DELETE FROM danh_muc WHERE id = $1`, [id]);
        } catch (err: any) {
            // Ném lỗi để controller xử lý nếu có ràng buộc khóa ngoại
            throw err;
        }
    }


}
