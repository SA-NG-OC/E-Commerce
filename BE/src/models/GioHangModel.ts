import { SanPham } from "../models/SanPhamModel";

export class GioHangModel {
    private _id: number;
    private _nguoi_dung_id: number;
    private _san_pham: { san_pham: SanPham; so_luong: number }[];

    constructor(id: number, nguoi_dung_id: number, san_pham: { san_pham: SanPham; so_luong: number }[] = []) {
        this._id = id;
        this._nguoi_dung_id = nguoi_dung_id;
        this._san_pham = san_pham;
    }

    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }

    get nguoi_dung_id(): number {
        return this._nguoi_dung_id;
    }
    set nguoi_dung_id(value: number) {
        this._nguoi_dung_id = value;
    }

    get san_pham(): { san_pham: SanPham; so_luong: number }[] {
        return this._san_pham;
    }
    set san_pham(value: { san_pham: SanPham; so_luong: number }[]) {
        this._san_pham = value;
    }

    // Thêm sản phẩm vào giỏ hàng
    themSanPham(san_pham: SanPham, so_luong: number = 1) {
        const index = this._san_pham.findIndex(item => item.san_pham.id === san_pham.id);
        if (index !== -1) {
            this._san_pham[index].so_luong += so_luong;
        } else {
            this._san_pham.push({ san_pham, so_luong });
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    xoaSanPham(san_pham_id: string) {
        this._san_pham = this._san_pham.filter(item => item.san_pham.id !== san_pham_id);
    }

    // Cập nhật số lượng sản phẩm
    capNhatSoLuong(san_pham_id: string, so_luong: number) {
        const item = this._san_pham.find(item => item.san_pham.id === san_pham_id);
        if (item) {
            item.so_luong = so_luong;
        }
    }

    // Lấy tổng số lượng sản phẩm trong giỏ
    tongSoLuong(): number {
        return this._san_pham.reduce((sum, item) => sum + item.so_luong, 0);
    }

    // Lấy tổng giá trị giỏ hàng
    tongGiaTri(): number {
        return this._san_pham.reduce((sum, item) => sum + item.san_pham.gia_ban * item.so_luong, 0);
    }
}