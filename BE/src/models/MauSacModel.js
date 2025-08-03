"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MauSacModel = void 0;
class MauSacModel {
    constructor(id, ten_Mau_Sac, ma_Mau) {
        this.id = id;
        this._ten_Mau_Sac = ten_Mau_Sac;
        this._ma_Mau = ma_Mau;
    }
    get ten_Mau_Sac() {
        return this._ten_Mau_Sac;
    }
    set ten_Mau_Sac(value) {
        this._ten_Mau_Sac = value;
    }
    get ma_Mau() {
        return this._ma_Mau;
    }
    set ma_Mau(value) {
        this._ma_Mau = value;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
}
exports.MauSacModel = MauSacModel;
