"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThuongHieuModel = void 0;
class ThuongHieuModel {
    constructor(data) {
        var _a;
        this._san_phams = [];
        this._id = data.id;
        this._ten_thuong_hieu = data.ten_thuong_hieu;
        this._san_phams = (_a = data.san_phams) !== null && _a !== void 0 ? _a : [];
    }
    get id() {
        return this._id;
    }
    get ten_thuong_hieu() {
        return this._ten_thuong_hieu;
    }
    get san_phams() {
        return this._san_phams;
    }
    set san_phams(value) {
        this._san_phams = value;
    }
}
exports.ThuongHieuModel = ThuongHieuModel;
