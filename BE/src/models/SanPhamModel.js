"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanPham = void 0;
class SanPham {
    constructor(data) {
        var _a, _b, _c, _d, _e, _f;
        this._danh_sach_bien_the = [];
        this._danh_sach_hinh_anh = [];
        this._id = (_a = data.id) !== null && _a !== void 0 ? _a : '';
        this._ten_san_pham = data.ten_san_pham;
        this._ma_san_pham = data.ma_san_pham;
        this._gia_ban = data.gia_ban;
        this._danh_muc = (_b = data.danh_muc) !== null && _b !== void 0 ? _b : null;
        this._thuong_hieu = (_c = data.thuong_hieu) !== null && _c !== void 0 ? _c : null;
        this._mo_ta = (_d = data.mo_ta) !== null && _d !== void 0 ? _d : null;
        this._danh_sach_bien_the = (_e = data.danh_sach_bien_the) !== null && _e !== void 0 ? _e : [];
        this._danh_sach_hinh_anh = (_f = data.danh_sach_hinh_anh) !== null && _f !== void 0 ? _f : [];
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get ten_san_pham() {
        return this._ten_san_pham;
    }
    set ten_san_pham(value) {
        this._ten_san_pham = value;
    }
    get ma_san_pham() {
        return this._ma_san_pham;
    }
    set ma_san_pham(value) {
        this._ma_san_pham = value;
    }
    get gia_ban() {
        return this._gia_ban;
    }
    set gia_ban(value) {
        this._gia_ban = value;
    }
    get danh_muc() {
        return this._danh_muc;
    }
    set danh_muc(value) {
        this._danh_muc = value;
    }
    get thuong_hieu() {
        return this._thuong_hieu;
    }
    set thuong_hieu(value) {
        this._thuong_hieu = value;
    }
    get mo_ta() {
        return this._mo_ta;
    }
    set mo_ta(value) {
        this._mo_ta = value;
    }
    get danh_sach_bien_the() {
        return this._danh_sach_bien_the;
    }
    set danh_sach_bien_the(value) {
        this._danh_sach_bien_the = value;
    }
    get danh_sach_hinh_anh() {
        return this._danh_sach_hinh_anh;
    }
    set danh_sach_hinh_anh(value) {
        this._danh_sach_hinh_anh = value;
    }
}
exports.SanPham = SanPham;
