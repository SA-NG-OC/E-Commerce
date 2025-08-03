import { HinhAnhSPModel } from '../models/HinhAnhSPModel';
import pool from '../config/db';

export class HinhAnhSPService {
    // Lấy danh sách ảnh theo sản phẩm
    static async getByProductId(productId: string): Promise<HinhAnhSPModel[]> {
        try {
            const query = 'SELECT * FROM hinh_anh_san_pham WHERE san_pham_id = $1 ORDER BY id';
            const result = await pool.query(query, [productId]);

            return result.rows.map((row: any) => new HinhAnhSPModel({
                id: row.id,
                san_pham_id: row.san_pham_id,
                mau_sac_id: row.mau_sac_id,
                duong_dan_hinh_anh: row.duong_dan_hinh_anh
            }));
        } catch (error) {
            console.error('Lỗi khi lấy ảnh sản phẩm:', error);
            throw error;
        }
    }

    // Thêm ảnh mới
    static async create(data: {
        san_pham_id: string;
        mau_sac_id: string;
        duong_dan_hinh_anh: string;
    }): Promise<boolean> {
        try {
            const id = await this.generateId();
            const query = `
                INSERT INTO hinh_anh_san_pham (id, san_pham_id, mau_sac_id, duong_dan_hinh_anh)
                VALUES ($1, $2, $3, $4)
            `;
            const result = await pool.query(query, [
                id,
                data.san_pham_id,
                data.mau_sac_id,
                data.duong_dan_hinh_anh
            ]);

            return result.rowCount! > 0;
        } catch (error) {
            console.error('Lỗi khi thêm ảnh:', error);
            throw error;
        }
    }

    // Xóa ảnh theo đường dẫn
    static async delete(duongDan: string): Promise<boolean> {
        try {
            const query = 'DELETE FROM hinh_anh_san_pham WHERE duong_dan_hinh_anh = $1';
            const result = await pool.query(query, [duongDan]);
            return result.rowCount! > 0;
        } catch (error) {
            console.error('Lỗi khi xóa ảnh:', error);
            throw error;
        }
    }


    // Tạo ID tự động
    private static async generateId(): Promise<string> {
        const query = 'SELECT COUNT(*) as count FROM hinh_anh_san_pham';
        const result = await pool.query(query);
        const count = parseInt(result.rows[0].count, 10) + 1;
        return `IMG${count.toString().padStart(7, '0')}`;
    }
}
