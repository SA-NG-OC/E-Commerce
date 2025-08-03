"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BienTheSPModel = void 0;
class BienTheSPModel {
    constructor(data) {
        this._id = data.id;
        this._san_pham_id = data.san_pham_id;
        this._mau_sac_id = data.mau_sac_id;
        this._mau_sac = data.mau_sac;
        this._ma_mau = data.ma_mau;
        this._kich_co = data.kich_co;
        this._kich_co_id = data.kich_co_id;
        this._so_luong_ton_kho = data.so_luong_ton_kho;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get san_pham_id() {
        return this._san_pham_id;
    }
    set san_pham_id(value) {
        this._san_pham_id = value;
    }
    get mau_sac_id() {
        return this._mau_sac_id;
    }
    set mau_sac_id(value) {
        this._mau_sac_id = value;
    }
    get mau_sac() {
        return this._mau_sac;
    }
    set mau_sac(value) {
        this._mau_sac = value;
    }
    get ma_mau() {
        return this._ma_mau;
    }
    set ma_mau(value) {
        this._ma_mau = value;
    }
    get kich_co() {
        return this._kich_co;
    }
    set kich_co(value) {
        this._kich_co = value;
    }
    get kich_co_id() {
        return this._kich_co_id;
    }
    set kich_co_id(value) {
        this._kich_co_id = value;
    }
    get so_luong_ton_kho() {
        return this._so_luong_ton_kho;
    }
    set so_luong_ton_kho(value) {
        this._so_luong_ton_kho = value;
    }
}
exports.BienTheSPModel = BienTheSPModel;
