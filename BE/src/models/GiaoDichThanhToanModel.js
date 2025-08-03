"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiaoDichThanhToanModel = void 0;
class GiaoDichThanhToanModel {
    constructor(data) {
        var _a, _b, _c, _d, _e;
        this._id = (_a = data.id) !== null && _a !== void 0 ? _a : '';
        this._don_hang_id = data.don_hang_id;
        this._phuong_thuc_thanh_toan = data.phuong_thuc_thanh_toan;
        this._so_tien = data.so_tien;
        this._trang_thai = (_b = data.trang_thai) !== null && _b !== void 0 ? _b : 'cho_thanh_toan';
        this._ma_giao_dich = (_c = data.ma_giao_dich) !== null && _c !== void 0 ? _c : null;
        this._ngay_thanh_toan = (_d = data.ngay_thanh_toan) !== null && _d !== void 0 ? _d : null;
        this._ghi_chu = (_e = data.ghi_chu) !== null && _e !== void 0 ? _e : null;
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
    get phuong_thuc_thanh_toan() {
        return this._phuong_thuc_thanh_toan;
    }
    set phuong_thuc_thanh_toan(value) {
        this._phuong_thuc_thanh_toan = value;
    }
    get so_tien() {
        return this._so_tien;
    }
    set so_tien(value) {
        this._so_tien = value;
    }
    get trang_thai() {
        return this._trang_thai;
    }
    set trang_thai(value) {
        this._trang_thai = value;
    }
    get ma_giao_dich() {
        return this._ma_giao_dich;
    }
    set ma_giao_dich(value) {
        this._ma_giao_dich = value;
    }
    get ngay_thanh_toan() {
        return this._ngay_thanh_toan;
    }
    set ngay_thanh_toan(value) {
        this._ngay_thanh_toan = value;
    }
    get ghi_chu() {
        return this._ghi_chu;
    }
    set ghi_chu(value) {
        this._ghi_chu = value;
    }
}
exports.GiaoDichThanhToanModel = GiaoDichThanhToanModel;
