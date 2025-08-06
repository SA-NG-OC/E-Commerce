import pool from '../config/db';
import { ThuongHieuModel } from '../models/ThuongHieuModel';
import { SanPham } from '../models/SanPhamModel';
import { HinhAnhSPModel } from '../models/HinhAnhSPModel';

export class ThuongHieuService {
    // Lấy tất cả thương hiệu kèm sản phẩm (ảnh đại diện đầu tiên)
    static async getAll(): Promise<ThuongHieuModel[]> {
        const thuongHieuResult = await pool.query(`SELECT * FROM thuong_hieu ORDER BY ten_thuong_hieu`);

        const thuongHieuList: ThuongHieuModel[] = [];

        for (const th of thuongHieuResult.rows) {
            const sanPhamResult = await pool.query(`
                SELECT sp.*, 
                       dm.ten_danh_muc, 
                       th.ten_thuong_hieu,
                       ha.id as ha_id, ha.mau_sac_id, ha.duong_dan_hinh_anh
                FROM san_pham sp
                LEFT JOIN danh_muc dm ON sp.danh_muc_id = dm.id
                LEFT JOIN thuong_hieu th ON sp.thuong_hieu_id = th.id
                LEFT JOIN LATERAL (
                    SELECT * FROM hinh_anh_san_pham 
                    WHERE san_pham_id = sp.id 
                    ORDER BY id ASC LIMIT 1
                ) ha ON true
                WHERE sp.thuong_hieu_id = $1
            `, [th.id]);

            const san_phams: SanPham[] = sanPhamResult.rows.map(row => {
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

            thuongHieuList.push(new ThuongHieuModel({
                id: th.id,
                ten_thuong_hieu: th.ten_thuong_hieu,
                san_phams
            }));
        }

        return thuongHieuList;
    }

    static async updateName(id: string, ten_thuong_hieu: string): Promise<void> {
        await pool.query(
            'UPDATE thuong_hieu SET ten_thuong_hieu = $1 WHERE id = $2',
            [ten_thuong_hieu, id]
        );
    }

    static async delete(id: string): Promise<void> {
        try {
            await pool.query(`DELETE FROM thuong_hieu WHERE id = $1`, [id]);
        } catch (err: any) {
            throw err; // ném lỗi cho controller xử lý
        }
    }

    static async create(ten_thuong_hieu: string): Promise<void> {
        // Tìm ID lớn nhất theo định dạng THxxx
        const result = await pool.query(`
        SELECT id FROM thuong_hieu
        WHERE id ~ '^TH[0-9]{3}$'
        ORDER BY id DESC
        LIMIT 1
    `);

        let nextId: string;
        if (result.rows.length === 0) {
            nextId = 'TH001'; // Nếu chưa có bản ghi nào
        } else {
            const maxId = result.rows[0].id; // ví dụ: 'TH014'
            const number = parseInt(maxId.slice(2), 10) + 1;
            nextId = 'TH' + number.toString().padStart(3, '0'); // ví dụ: 'TH015'
        }

        // Thêm thương hiệu mới
        await pool.query(
            'INSERT INTO thuong_hieu (id, ten_thuong_hieu) VALUES ($1, $2)',
            [nextId, ten_thuong_hieu]
        );
    }


}
