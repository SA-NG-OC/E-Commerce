"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NguoiDungModel = void 0;
class NguoiDungModel {
    constructor(data) {
        this._id = data.id;
        this._email = data.email;
        this._mat_khau_hash = data.mat_khau_hash;
        this._ho = data.ho;
        this._ten = data.ten;
        this._so_dien_thoai = data.so_dien_thoai;
        this._dia_chi = data.dia_chi;
        this._ngay_sinh = data.ngay_sinh;
        this._role_id = data.role_id;
    }
    get id() { return this._id; }
    set id(v) { this._id = v; }
    get email() { return this._email; }
    set email(v) { this._email = v; }
    get mat_khau_hash() { return this._mat_khau_hash; }
    set mat_khau_hash(v) { this._mat_khau_hash = v; }
    get ho() { return this._ho; }
    set ho(v) { this._ho = v; }
    get ten() { return this._ten; }
    set ten(v) { this._ten = v; }
    get so_dien_thoai() { return this._so_dien_thoai; }
    set so_dien_thoai(v) { this._so_dien_thoai = v; }
    get dia_chi() { return this._dia_chi; }
    set dia_chi(v) { this._dia_chi = v; }
    get ngay_sinh() { return this._ngay_sinh; }
    set ngay_sinh(v) { this._ngay_sinh = v; }
    get role_id() { return this._role_id; }
    set role_id(v) { this._role_id = v; }
}
exports.NguoiDungModel = NguoiDungModel;
