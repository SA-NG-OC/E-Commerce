import pool from '../config/db';
import { GioHangModel } from '../models/GioHangModel';
import { SanPham } from '../models/SanPhamModel';
import { HinhAnhSPModel } from '../models/HinhAnhSPModel';


export class GioHangService {
    // Load giỏ hàng theo nguoi_dung_id
    static async loadGioHangByNguoiDungId(nguoi_dung_id: number): Promise<GioHangModel | null> {
        // Lấy thông tin giỏ hàng
        const gioHangRes = await pool.query('SELECT * FROM gio_hang WHERE nguoi_dung_id = $1 LIMIT 1', [nguoi_dung_id]);
        if (gioHangRes.rowCount === 0) return null;
        const gioHang = gioHangRes.rows[0];

        // Lấy các sản phẩm trong giỏ hàng
        const spghRes = await pool.query('SELECT * FROM san_pham_gio_hang WHERE gio_hang_id = $1', [gioHang.id]);
        const san_pham_arr: { san_pham: SanPham; so_luong: number }[] = [];
        for (const spgh of spghRes.rows) {
            // Lấy thông tin sản phẩm
            const spRes = await pool.query('SELECT * FROM san_pham WHERE id = $1', [spgh.san_pham_id]);
            if (spRes.rowCount === 0) continue;
            const sp = spRes.rows[0];

            // Lấy danh sách hình ảnh sản phẩm
            const haRes = await pool.query('SELECT * FROM hinh_anh_san_pham WHERE san_pham_id = $1', [sp.id]);
            const danh_sach_hinh_anh: HinhAnhSPModel[] = haRes.rows.map((ha: any) =>
                new HinhAnhSPModel(ha.id, ha.san_pham_id, ha.duong_dan_hinh_anh)
            );

            const sanPham = new SanPham({
                id: sp.id,
                ten_san_pham: sp.ten_san_pham,
                ma_san_pham: sp.ma_san_pham,
                gia_ban: Number(sp.gia_ban),
                so_luong_ton_kho: sp.so_luong_ton_kho,
                danh_muc: sp.danh_muc_id ?? null,
                thuong_hieu: sp.thuong_hieu_id ?? null,
                mo_ta: sp.mo_ta ?? null,
                danh_sach_hinh_anh
            });
            san_pham_arr.push({ san_pham: sanPham, so_luong: spgh.so_luong });
        }
        return new GioHangModel(gioHang.id, gioHang.nguoi_dung_id, san_pham_arr);
    }

    // Xóa một sản phẩm khỏi giỏ hàng
    static async xoaSanPhamKhoiGio(gio_hang_id: string, san_pham_id: string): Promise<void> {
        await pool.query('DELETE FROM san_pham_gio_hang WHERE gio_hang_id = $1 AND san_pham_id = $2', [gio_hang_id, san_pham_id]);
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    static async capNhatSoLuong(gio_hang_id: string, san_pham_id: string, so_luong: number): Promise<void> {
        if (so_luong > 0) {
            await pool.query('UPDATE san_pham_gio_hang SET so_luong = $1 WHERE gio_hang_id = $2 AND san_pham_id = $3', [so_luong, gio_hang_id, san_pham_id]);
        } else {
            // Nếu số lượng <= 0 thì xóa luôn sản phẩm khỏi giỏ
            await this.xoaSanPhamKhoiGio(gio_hang_id, san_pham_id);
        }
    }

    static async createGioHang(nguoi_dung_id: number): Promise<GioHangModel> {
        // Tạo giỏ hàng mới
        const result = await pool.query('INSERT INTO gio_hang (nguoi_dung_id) VALUES ($1) RETURNING *', [nguoi_dung_id]);
        const gioHang = result.rows[0];
        return new GioHangModel(gioHang.id, gioHang.nguoi_dung_id);
    }
}
