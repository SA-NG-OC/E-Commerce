"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiaChiGiaoHangModel = void 0;
class DiaChiGiaoHangModel {
    constructor(data) {
        var _a, _b, _c, _d;
        this._id = (_a = data.id) !== null && _a !== void 0 ? _a : '';
        this._don_hang_id = data.don_hang_id;
        this._ho_ten_nguoi_nhan = data.ho_ten_nguoi_nhan;
        this._so_dien_thoai = data.so_dien_thoai;
        this._dia_chi_chi_tiet = data.dia_chi_chi_tiet;
        this._phuong_xa = (_b = data.phuong_xa) !== null && _b !== void 0 ? _b : null;
        this._tinh_thanh = (_c = data.tinh_thanh) !== null && _c !== void 0 ? _c : null;
        this._ghi_chu = (_d = data.ghi_chu) !== null && _d !== void 0 ? _d : null;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get don_hang_id() {
        return this._don_hang_id;
    }
    set don_hang_id(value) {
        this._don_hang_id = value;
    }
    get ho_ten_nguoi_nhan() {
        return this._ho_ten_nguoi_nhan;
    }
    set ho_ten_nguoi_nhan(value) {
        this._ho_ten_nguoi_nhan = value;
    }
    get so_dien_thoai() {
        return this._so_dien_thoai;
    }
    set so_dien_thoai(value) {
        this._so_dien_thoai = value;
    }
    get dia_chi_chi_tiet() {
        return this._dia_chi_chi_tiet;
    }
    set dia_chi_chi_tiet(value) {
        this._dia_chi_chi_tiet = value;
    }
    get phuong_xa() {
        return this._phuong_xa;
    }
    set phuong_xa(value) {
        this._phuong_xa = value;
    }
    get tinh_thanh() {
        return this._tinh_thanh;
    }
    set tinh_thanh(value) {
        this._tinh_thanh = value;
    }
    get ghi_chu() {
        return this._ghi_chu;
    }
    set ghi_chu(value) {
        this._ghi_chu = value;
    }
}
exports.DiaChiGiaoHangModel = DiaChiGiaoHangModel;
