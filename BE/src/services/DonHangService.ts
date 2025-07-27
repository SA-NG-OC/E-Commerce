import pool from '../config/db';
import { DonHangModel } from '../models/DonHangModel';

export class DonHangService {
    async getDonHangByNguoiDungId(nguoi_dung_id: string): Promise<DonHangModel[]> {
        const query = `
            SELECT 
                dh.id AS don_hang_id,
                dh.nguoi_dung_id,
                dh.tong_thanh_toan,
                dh.trang_thai,
                dh.ngay_tao,

                sp.ten_san_pham,
                sp.id AS san_pham_id,
                bts.id AS bien_the_id,
                ct.gia_ban,
                ms.ten_mau AS mau_sac,
                kc.so_kich_co AS kich_co,
                hasp.duong_dan_hinh_anh AS hinh_anh_bien_the,
                ct.so_luong

            FROM don_hang dh
            JOIN chi_tiet_don_hang ct ON ct.don_hang_id = dh.id
            JOIN bien_the_san_pham bts ON ct.bien_the_id = bts.id
            JOIN san_pham sp ON sp.id = bts.san_pham_id
            JOIN mau_sac ms ON ms.id = bts.mau_sac_id
            JOIN kich_co kc ON kc.id = bts.kich_co_id

            LEFT JOIN (
                SELECT 
                    san_pham_id, 
                    mau_sac_id, 
                    duong_dan_hinh_anh
                FROM (
                    SELECT *, 
                        ROW_NUMBER() OVER (
                            PARTITION BY san_pham_id, mau_sac_id 
                            ORDER BY id
                        ) AS rn
                    FROM hinh_anh_san_pham
                ) AS ranked
                WHERE rn = 1
            ) AS hasp 
                ON hasp.san_pham_id = sp.id 
                AND hasp.mau_sac_id = bts.mau_sac_id

            WHERE dh.nguoi_dung_id = $1
            ORDER BY dh.ngay_tao DESC;
        `;

        const result = await pool.query(query, [nguoi_dung_id]);

        if (result.rows.length === 0) return [];

        // Nhóm theo don_hang_id
        const donHangMap = new Map<string, DonHangModel>();

        for (const row of result.rows) {
            const donHangId = row.don_hang_id;

            if (!donHangMap.has(donHangId)) {
                donHangMap.set(
                    donHangId,
                    new DonHangModel(
                        donHangId,
                        row.nguoi_dung_id,
                        parseFloat(row.tong_thanh_toan),
                        row.trang_thai,
                        row.ngay_tao,
                        [] // Danh sách sản phẩm sẽ được đẩy vào sau
                    )
                );
            }

            donHangMap.get(donHangId)?.san_pham.push({
                ten_san_pham: row.ten_san_pham,
                id_san_pham: row.san_pham_id,
                id_bien_the: row.bien_the_id,
                gia_ban: parseFloat(row.gia_ban),
                mau_sac: row.mau_sac,
                kich_co: row.kich_co,
                hinh_anh_bien_the: row.hinh_anh_bien_the,
                so_luong: row.so_luong
            });
        }

        return Array.from(donHangMap.values());
    }

    async huyDonHang(don_hang_id: string, nguoi_dung_id?: string): Promise<{ success: boolean; message: string }> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Kiểm tra trạng thái đơn hàng và quyền sở hữu (nếu có nguoi_dung_id)
            let checkQuery = `
            SELECT trang_thai, nguoi_dung_id 
            FROM don_hang 
            WHERE id = $1
        `;
            let checkParams = [don_hang_id];

            if (nguoi_dung_id) {
                checkQuery += ' AND nguoi_dung_id = $2';
                checkParams.push(nguoi_dung_id);
            }

            const checkResult = await client.query(checkQuery, checkParams);

            if (checkResult.rows.length === 0) {
                await client.query('ROLLBACK');
                return {
                    success: false,
                    message: 'Không tìm thấy đơn hàng hoặc bạn không có quyền hủy đơn hàng này'
                };
            }

            const donHang = checkResult.rows[0];

            if (donHang.trang_thai !== 'cho_xac_nhan') {
                await client.query('ROLLBACK');
                return {
                    success: false,
                    message: 'Chỉ có thể hủy đơn hàng đang ở trạng thái "Chờ xác nhận"'
                };
            }

            // Cập nhật trạng thái đơn hàng thành 'da_huy'
            await client.query(`
            UPDATE don_hang 
            SET trang_thai = 'da_huy' 
            WHERE id = $1
        `, [don_hang_id]);

            await client.query('COMMIT');

            return {
                success: true,
                message: 'Đơn hàng đã được hủy thành công'
            };

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Lỗi khi hủy đơn hàng:', error);

            return {
                success: false,
                message: 'Có lỗi xảy ra khi hủy đơn hàng'
            };
        } finally {
            client.release();
        }
    }

}
