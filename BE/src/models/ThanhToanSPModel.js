"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThanhToanSPModel = void 0;
class ThanhToanSPModel {
    constructor(data) {
        this._bien_the_id = data.bien_the_id;
        this._ten_san_pham = data.ten_san_pham;
        this._so_luong = data.so_luong;
        this._don_gia = data.don_gia;
        this._mau_sac = data.mau_sac;
        this._kich_co = data.kich_co;
        this._duong_dan_hinh_anh = data.duong_dan_hinh_anh;
    }
    get bien_the_id() {
        return this._bien_the_id;
    }
    set bien_the_id(value) {
        this._bien_the_id = value;
    }
    get ten_san_pham() {
        return this._ten_san_pham;
    }
    set ten_san_pham(value) {
        this._ten_san_pham = value;
    }
    get so_luong() {
        return this._so_luong;
    }
    set so_luong(value) {
        this._so_luong = value;
    }
    get don_gia() {
        return this._don_gia;
    }
    set don_gia(value) {
        this._don_gia = value;
    }
    get mau_sac() {
        return this._mau_sac;
    }
    set mau_sac(value) {
        this._mau_sac = value;
    }
    get kich_co() {
        return this._kich_co;
    }
    set kich_co(value) {
        this._kich_co = value;
    }
    get duong_dan_hinh_anh() {
        return this._duong_dan_hinh_anh;
    }
    set duong_dan_hinh_anh(value) {
        this._duong_dan_hinh_anh = value;
    }
}
exports.ThanhToanSPModel = ThanhToanSPModel;
