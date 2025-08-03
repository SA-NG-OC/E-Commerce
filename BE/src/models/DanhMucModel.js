"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DanhMucModel = void 0;
class DanhMucModel {
    constructor(id, ten_danh_muc, icon, san_phams = []) {
        this._san_phams = [];
        this._id = id;
        this._ten_danh_muc = ten_danh_muc;
        this._icon = icon;
        this._san_phams = san_phams;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get ten_danh_muc() {
        return this._ten_danh_muc;
    }
    set ten_danh_muc(value) {
        this._ten_danh_muc = value;
    }
    get icon() {
        return this._icon;
    }
    set icon(value) {
        this._icon = value;
    }
    get san_phams() {
        return this._san_phams;
    }
    set san_phams(value) {
        this._san_phams = value;
    }
}
exports.DanhMucModel = DanhMucModel;
