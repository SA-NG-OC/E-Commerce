import pool from '../config/db';
import { GiaoDichThanhToanModel, TrangThaiGiaoDich } from '../models/GiaoDichThanhToanModel';
import { randomUUID } from 'crypto';

export class GiaoDichThanhToanService {
    static async create(data: {
        don_hang_id: string;
        phuong_thuc_thanh_toan: string;
        ghi_chu?: string | null;
    }): Promise<GiaoDichThanhToanModel | null> {
        const client = await pool.connect();
        try {
            // 1. Lấy tổng thanh toán từ đơn hàng
            const donHangRes = await client.query(
                `SELECT tong_thanh_toan FROM don_hang WHERE id = $1`,
                [data.don_hang_id]
            );
            if (donHangRes.rowCount === 0) return null;

            const tong_thanh_toan = donHangRes.rows[0].tong_thanh_toan;

            // 2. Tạo ID mới dạng TTxxx
            const idRes = await client.query(
                `SELECT id FROM giao_dich_thanh_toan WHERE id LIKE 'TT%' ORDER BY id DESC LIMIT 1`
            );
            let newIdNumber = 1;
            if (idRes.rowCount === 0) {
                newIdNumber = 1; // Nếu không có giao dịch nào, bắt đầu từ TT001
            }
            else {
                const lastId = idRes.rows[0].id;
                const numberPart = parseInt(lastId.replace('TT', ''), 10);
                newIdNumber = numberPart + 1;
            }
            const newId = 'TT' + newIdNumber.toString().padStart(3, '0');

            // 3. Xác định trạng thái và thông tin thanh toán
            let trang_thai: TrangThaiGiaoDich;
            let ma_giao_dich: string | null = null;
            let ngay_thanh_toan: Date | null = null;

            const isCOD = data.phuong_thuc_thanh_toan.trim().toLowerCase() === 'cod';
            if (isCOD) {
                trang_thai = 'cho_thanh_toan';
            } else {
                trang_thai = 'da_thanh_toan';
                ma_giao_dich = randomUUID();
                ngay_thanh_toan = new Date();
            }

            // 4. Thêm giao dịch vào database
            await client.query(
                `INSERT INTO giao_dich_thanh_toan (
                    id, don_hang_id, phuong_thuc_thanh_toan, so_tien,
                    trang_thai, ma_giao_dich, ngay_thanh_toan, ghi_chu
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [
                    newId,
                    data.don_hang_id,
                    data.phuong_thuc_thanh_toan,
                    tong_thanh_toan,
                    trang_thai,
                    ma_giao_dich,
                    ngay_thanh_toan,
                    data.ghi_chu ?? null
                ]
            );

            return new GiaoDichThanhToanModel({
                id: newId,
                don_hang_id: data.don_hang_id,
                phuong_thuc_thanh_toan: data.phuong_thuc_thanh_toan,
                so_tien: tong_thanh_toan,
                trang_thai,
                ma_giao_dich,
                ngay_thanh_toan,
                ghi_chu: data.ghi_chu ?? null
            });
        } catch (err) {
            console.error('Lỗi khi tạo giao dịch thanh toán:', err);
            return null;
        } finally {
            client.release();
        }
    }
}
