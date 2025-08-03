"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DanhGiaSPModel = void 0;
class DanhGiaSPModel {
    constructor(data) {
        this._id = data.id;
        this._san_pham_id = data.san_pham_id;
        this._nguoi_dung_id = data.nguoi_dung_id;
        this._diem_danh_gia = data.diem_danh_gia;
        this._noi_dung_danh_gia = data.noi_dung_danh_gia;
        this._ngay_tao = typeof data.ngay_tao === 'string' ? new Date(data.ngay_tao) : data.ngay_tao;
        this._ho_ten_nguoi_dung = data.ho_ten_nguoi_dung;
    }
    get id() { return this._id; }
    set id(value) { this._id = value; }
    get san_pham_id() { return this._san_pham_id; }
    set san_pham_id(value) { this._san_pham_id = value; }
    get nguoi_dung_id() { return this._nguoi_dung_id; }
    set nguoi_dung_id(value) { this._nguoi_dung_id = value; }
    get diem_danh_gia() { return this._diem_danh_gia; }
    set diem_danh_gia(value) { this._diem_danh_gia = value; }
    get noi_dung_danh_gia() { return this._noi_dung_danh_gia; }
    set noi_dung_danh_gia(value) { this._noi_dung_danh_gia = value; }
    get ngay_tao() { return this._ngay_tao; }
    set ngay_tao(value) { this._ngay_tao = value; }
    get ho_ten_nguoi_dung() { return this._ho_ten_nguoi_dung; }
    set ho_ten_nguoi_dung(value) { this._ho_ten_nguoi_dung = value; }
}
exports.DanhGiaSPModel = DanhGiaSPModel;
