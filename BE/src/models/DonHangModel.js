"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonHangModel = void 0;
class DonHangModel {
    constructor(id, nguoi_dung_id, tong_thanh_toan, trang_thai, ngay_tao, san_pham) {
        this._id = id;
        this._nguoi_dung_id = nguoi_dung_id;
        this._tong_thanh_toan = tong_thanh_toan;
        this._trang_thai = trang_thai;
        this._ngay_tao = ngay_tao;
        this._san_pham = san_pham;
    }
    // Getters and Setters
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get nguoi_dung_id() {
        return this._nguoi_dung_id;
    }
    set nguoi_dung_id(value) {
        this._nguoi_dung_id = value;
    }
    get tong_thanh_toan() {
        return this._tong_thanh_toan;
    }
    set tong_thanh_toan(value) {
        this._tong_thanh_toan = value;
    }
    get trang_thai() {
        return this._trang_thai;
    }
    set trang_thai(value) {
        this._trang_thai = value;
    }
    get ngay_tao() {
        return this._ngay_tao;
    }
    set ngay_tao(value) {
        this._ngay_tao = value;
    }
    get san_pham() {
        return this._san_pham;
    }
    set san_pham(value) {
        this._san_pham = value;
    }
}
exports.DonHangModel = DonHangModel;
