"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HinhAnhSPModel = void 0;
class HinhAnhSPModel {
    constructor(data) {
        var _a;
        this._id = (_a = data.id) !== null && _a !== void 0 ? _a : '';
        this._san_pham_id = data.san_pham_id;
        this._mau_sac_id = data.mau_sac_id;
        this._duong_dan_hinh_anh = data.duong_dan_hinh_anh;
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
    get duong_dan_hinh_anh() {
        return this._duong_dan_hinh_anh;
    }
    set duong_dan_hinh_anh(value) {
        this._duong_dan_hinh_anh = value;
    }
}
exports.HinhAnhSPModel = HinhAnhSPModel;
