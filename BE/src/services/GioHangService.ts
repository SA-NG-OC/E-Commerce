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
            const sp_id = await pool.query('SELECT san_pham_id FROM bien_the_san_pham WHERE id = $1', [spgh.bien_the_id]);
            if (sp_id.rowCount === 0) continue;
            const sanPhamGioHang = sp_id.rows[0];
            // Lấy thông tin sản phẩm
            const spRes = await pool.query('SELECT * FROM san_pham WHERE id = $1', [sanPhamGioHang.san_pham_id]);
            if (spRes.rowCount === 0) continue;
            const sp = spRes.rows[0];

            // Lấy thông tin biến thể
            const btRes = await pool.query('SELECT * FROM bien_the_san_pham WHERE id = $1', [spgh.bien_the_id]);
            if (btRes.rowCount === 0) continue;
            const bt = btRes.rows[0];
            const bien_the = new BienTheSPModel({
                id: bt.id,
                san_pham_id: bt.san_pham_id,
                mau_sac_id: bt.mau_sac_id,
                kich_co_id: bt.kich_co_id,
                so_luong_ton_kho: bt.so_luong_ton_kho
            });
            // Lấy hình ảnh sản phẩm
            const haRes = await pool.query(
                'SELECT duong_dan_hinh_anh FROM hinh_anh_san_pham WHERE san_pham_id = $1 AND mau_sac_id = $2',
                [sp.id, bien_the.mau_sac_id]
            );
            const hinh_anh_bien_the: string = haRes.rows[0].duong_dan_hinh_anh || '';
            // Lấy màu sác và kích cỡ
            const mau_sac_query = await pool.query('SELECT ten_mau FROM mau_sac WHERE id = $1', [bien_the.mau_sac_id]);
            const kich_co_query = await pool.query('SELECT so_kich_co FROM kich_co WHERE id = $1', [bien_the.kich_co_id]);
            if (mau_sac_query.rowCount === 0 || kich_co_query.rowCount === 0) continue;
            const mau_sac: string = mau_sac_query.rows[0].ten_mau || '';
            const kich_co: string = kich_co_query.rows[0].so_kich_co || '';

            spItems.push({ ten_san_pham: sp.ten_san_pham, id_san_pham: sp.id, id_bien_the: bt.id, gia_ban: sp.gia_ban, so_luong_ton: bien_the.so_luong_ton_kho, mau_sac, kich_co, hinh_anh_bien_the, so_luong: spgh.so_luong });
        }
        return new GioHangModel(gioHang.id, gioHang.nguoi_dung_id, spItems);
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
