"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GioHangModel = void 0;
class GioHangModel {
    constructor(id, nguoi_dung_id, san_pham = []) {
        this._id = id;
        this._nguoi_dung_id = nguoi_dung_id;
        this._san_pham = san_pham;
    }
    get id() {
        return this._id;
    }
    get nguoi_dung_id() {
        return this._nguoi_dung_id;
    }
    get san_pham() {
        return this._san_pham;
    }
    set san_pham(value) {
        this._san_pham = value;
    }
    // Xóa sản phẩm khỏi giỏ theo id_bien_the
    xoaSanPham(id_bien_the) {
        this._san_pham = this._san_pham.filter(item => item.id_bien_the !== id_bien_the);
    }
    // Cập nhật số lượng theo id_bien_the
    capNhatSoLuong(id_bien_the, so_luong) {
        const item = this._san_pham.find(item => item.id_bien_the === id_bien_the);
        if (item) {
            item.so_luong = so_luong;
        }
    }
    // Tổng số lượng sản phẩm trong giỏ
    tongSoLuong() {
        return this._san_pham.reduce((sum, item) => sum + item.so_luong, 0);
    }
    // Tổng giá trị giỏ hàng dựa trên trường gia_ban
    tongGiaTri() {
        return this._san_pham.reduce((sum, item) => sum + item.gia_ban * item.so_luong, 0);
    }
}
exports.GioHangModel = GioHangModel;
