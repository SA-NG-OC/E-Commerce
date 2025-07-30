import pool from '../config/db';
import { GioHangModel } from '../models/GioHangModel';
import { SanPham } from '../models/SanPhamModel';
import { BienTheSPModel } from '../models/BienTheSPModel';
import { HinhAnhSPModel } from '../models/HinhAnhSPModel';

interface SanPhamGioHangRow {
    gio_hang_id: string;
    san_pham_id: string;
    bien_the_id: string;
    so_luong: number;
}

export class GioHangService {
    static async loadGioHangByNguoiDungId(nguoi_dung_id: string): Promise<GioHangModel | null> {
        try {
            const gioHangRes = await pool.query(
                'SELECT * FROM gio_hang WHERE nguoi_dung_id = $1 LIMIT 1',
                [nguoi_dung_id]
            );
            if (gioHangRes.rowCount === 0) return null;
            const gioHang = gioHangRes.rows[0];

            const spghRes = await pool.query(
                'SELECT * FROM san_pham_gio_hang WHERE gio_hang_id = $1',
                [gioHang.id]
            );
            const spItems: GioHangModel['san_pham'] = [];

            for (const spgh of spghRes.rows as SanPhamGioHangRow[]) {
                try {
                    // Lấy thông tin biến thể trước
                    const btRes = await pool.query('SELECT * FROM bien_the_san_pham WHERE id = $1', [spgh.bien_the_id]);
                    if (btRes.rowCount === 0) {
                        console.warn(`Không tìm thấy biến thể ${spgh.bien_the_id}`);
                        continue;
                    }
                    const bt = btRes.rows[0];

                    // Lấy thông tin sản phẩm
                    const spRes = await pool.query('SELECT * FROM san_pham WHERE id = $1', [bt.san_pham_id]);
                    if (spRes.rowCount === 0) {
                        console.warn(`Không tìm thấy sản phẩm ${bt.san_pham_id}`);
                        continue;
                    }
                    const sp = spRes.rows[0];

                    const bien_the = new BienTheSPModel({
                        id: bt.id,
                        san_pham_id: bt.san_pham_id,
                        mau_sac_id: bt.mau_sac_id,
                        kich_co_id: bt.kich_co_id,
                        so_luong_ton_kho: bt.so_luong_ton_kho
                    });

                    // 🔧 FIX: Kiểm tra hình ảnh an toàn
                    const haRes = await pool.query(
                        'SELECT duong_dan_hinh_anh FROM hinh_anh_san_pham WHERE san_pham_id = $1 AND mau_sac_id = $2',
                        [sp.id, bien_the.mau_sac_id]
                    );
                    const hinh_anh_bien_the: string = haRes.rows.length > 0 ?
                        (haRes.rows[0]?.duong_dan_hinh_anh || '') : '';

                    // 🔧 FIX: Kiểm tra màu sắc và kích cỡ an toàn
                    const mau_sac_query = await pool.query('SELECT ten_mau FROM mau_sac WHERE id = $1', [bien_the.mau_sac_id]);
                    const kich_co_query = await pool.query('SELECT so_kich_co FROM kich_co WHERE id = $1', [bien_the.kich_co_id]);

                    const mau_sac: string = mau_sac_query.rows.length > 0 ?
                        (mau_sac_query.rows[0]?.ten_mau || 'Không xác định') : 'Không xác định';
                    const kich_co: string = kich_co_query.rows.length > 0 ?
                        (kich_co_query.rows[0]?.so_kich_co || 'Không xác định') : 'Không xác định';

                    spItems.push({
                        ten_san_pham: sp.ten_san_pham,
                        id_san_pham: sp.id,
                        id_bien_the: bt.id,
                        gia_ban: sp.gia_ban,
                        so_luong_ton: bien_the.so_luong_ton_kho,
                        mau_sac,
                        kich_co,
                        hinh_anh_bien_the,
                        so_luong: spgh.so_luong
                    });
                } catch (itemError) {
                    console.error(`Lỗi xử lý item trong giỏ hàng:`, itemError);
                    // Tiếp tục xử lý item khác thay vì crash toàn bộ
                    continue;
                }
            }

            return new GioHangModel(gioHang.id, gioHang.nguoi_dung_id, spItems);
        } catch (error) {
            console.error('Lỗi trong loadGioHangByNguoiDungId:', error);
            throw error; // Ném lại để controller xử lý
        }
    }

    static async addSanPhamToGioHang(nguoi_dung_id: string, bien_the_id: string, so_luong: number): Promise<void> {
        try {
            // 🔧 FIX: Kiểm tra biến thể tồn tại trước
            const checkBienThe = await pool.query('SELECT id FROM bien_the_san_pham WHERE id = $1', [bien_the_id]);
            if (checkBienThe.rowCount === 0) {
                throw new Error(`Biến thể ${bien_the_id} không tồn tại`);
            }

            // 1. Tìm hoặc tạo giỏ hàng cho người dùng
            const gioHangRes = await pool.query('SELECT * FROM gio_hang WHERE nguoi_dung_id = $1 LIMIT 1', [nguoi_dung_id]);
            let gio_hang_id: string;

            if (gioHangRes.rowCount === 0) {
                // Nếu chưa có, tạo giỏ hàng mới
                const newGioHangId = 'GH' + Date.now();
                await pool.query('INSERT INTO gio_hang (id, nguoi_dung_id) VALUES ($1, $2)', [newGioHangId, nguoi_dung_id]);
                gio_hang_id = newGioHangId;
            } else {
                gio_hang_id = gioHangRes.rows[0].id;
            }

            // 🔧 FIX: Kiểm tra sản phẩm đã có trong giỏ hàng chưa
            const existingItem = await pool.query(
                'SELECT id, so_luong FROM san_pham_gio_hang WHERE gio_hang_id = $1 AND bien_the_id = $2',
                [gio_hang_id, bien_the_id]
            );

            if ((existingItem.rowCount ?? 0) > 0) {
                // Nếu đã có, cập nhật số lượng
                const newQuantity = existingItem.rows[0].so_luong + so_luong;
                await pool.query(
                    'UPDATE san_pham_gio_hang SET so_luong = $1 WHERE id = $2',
                    [newQuantity, existingItem.rows[0].id]
                );
                console.log(`Đã cập nhật số lượng sản phẩm ${bien_the_id} thành ${newQuantity}`);
            } else {
                // 🔧 FIX: Tạo ID an toàn hơn
                const idRes = await pool.query(
                    `SELECT id FROM san_pham_gio_hang WHERE id LIKE 'SPGH%' ORDER BY id DESC LIMIT 1`
                );

                let newIdNum = 1;
                if (idRes.rowCount === 0) {
                    newIdNum = 1; // Nếu không có sản phẩm nào, bắt đầu từ 1
                }
                else {
                    const lastId = idRes.rows[0].id;
                    const match = lastId.match(/SPGH(\d+)/);
                    if (match) {
                        newIdNum = parseInt(match[1]) + 1;
                    }
                }

                const newSpghId = `SPGH${newIdNum.toString().padStart(3, '0')}`;

                // 3. Thêm sản phẩm mới vào giỏ hàng
                await pool.query(
                    `INSERT INTO san_pham_gio_hang (id, gio_hang_id, bien_the_id, so_luong)
                 VALUES ($1, $2, $3, $4)`,
                    [newSpghId, gio_hang_id, bien_the_id, so_luong]
                );
                console.log(`Đã thêm sản phẩm mới ${bien_the_id} vào giỏ hàng`);
            }
        } catch (err) {
            console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', err);
            throw err;
        }
    }


    static async xoaSanPhamKhoiGio(gio_hang_id: string, bien_the_id: string): Promise<void> {
        await pool.query(
            'DELETE FROM san_pham_gio_hang WHERE gio_hang_id = $1 AND bien_the_id = $2',
            [gio_hang_id, bien_the_id]
        );
    }

    static async capNhatSoLuong(gio_hang_id: string, bien_the_id: string, so_luong: number): Promise<void> {
        if (so_luong > 0) {
            await pool.query(
                'UPDATE san_pham_gio_hang SET so_luong = $1 WHERE gio_hang_id = $2 AND bien_the_id = $3',
                [so_luong, gio_hang_id, bien_the_id]
            );
        } else {
            await this.xoaSanPhamKhoiGio(gio_hang_id, bien_the_id);
        }
    }

    static async createGioHang(nguoi_dung_id: string): Promise<GioHangModel> {
        const result = await pool.query(
            'INSERT INTO gio_hang (nguoi_dung_id) VALUES ($1) RETURNING *',
            [nguoi_dung_id]
        );
        const gioHang = result.rows[0];
        return new GioHangModel(gioHang.id, gioHang.nguoi_dung_id);
    }
}
