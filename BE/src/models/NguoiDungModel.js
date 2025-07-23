"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NguoiDungModel = void 0;
var NguoiDungModel = /** @class */ (function () {
    function NguoiDungModel(data) {
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
    Object.defineProperty(NguoiDungModel.prototype, "id", {
        get: function () { return this._id; },
        set: function (v) { this._id = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NguoiDungModel.prototype, "email", {
        get: function () { return this._email; },
        set: function (v) { this._email = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NguoiDungModel.prototype, "mat_khau_hash", {
        get: function () { return this._mat_khau_hash; },
        set: function (v) { this._mat_khau_hash = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NguoiDungModel.prototype, "ho", {
        get: function () { return this._ho; },
        set: function (v) { this._ho = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NguoiDungModel.prototype, "ten", {
        get: function () { return this._ten; },
        set: function (v) { this._ten = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NguoiDungModel.prototype, "so_dien_thoai", {
        get: function () { return this._so_dien_thoai; },
        set: function (v) { this._so_dien_thoai = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NguoiDungModel.prototype, "dia_chi", {
        get: function () { return this._dia_chi; },
        set: function (v) { this._dia_chi = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NguoiDungModel.prototype, "ngay_sinh", {
        get: function () { return this._ngay_sinh; },
        set: function (v) { this._ngay_sinh = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NguoiDungModel.prototype, "role_id", {
        get: function () { return this._role_id; },
        set: function (v) { this._role_id = v; },
        enumerable: false,
        configurable: true
    });
    return NguoiDungModel;
}());
exports.NguoiDungModel = NguoiDungModel;
