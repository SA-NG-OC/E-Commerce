export class NguoiDungModel {
    private _id: string;
    private _email: string;
    private _mat_khau_hash: string;
    private _ho: string;
    private _ten: string;
    private _so_dien_thoai: string;
    private _dia_chi: string;
    private _ngay_sinh: string;
    private _role_id: string;

    constructor(data: {
        id: string;
        email: string;
        mat_khau_hash: string;
        ho: string;
        ten: string;
        so_dien_thoai: string;
        dia_chi: string;
        ngay_sinh: string;
        role_id: string;
    }) {
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
    set id(v: string) { this._id = v; }
    get email() { return this._email; }
    set email(v: string) { this._email = v; }
    get mat_khau_hash() { return this._mat_khau_hash; }
    set mat_khau_hash(v: string) { this._mat_khau_hash = v; }
    get ho() { return this._ho; }
    set ho(v: string) { this._ho = v; }
    get ten() { return this._ten; }
    set ten(v: string) { this._ten = v; }
    get so_dien_thoai() { return this._so_dien_thoai; }
    set so_dien_thoai(v: string) { this._so_dien_thoai = v; }
    get dia_chi() { return this._dia_chi; }
    set dia_chi(v: string) { this._dia_chi = v; }
    get ngay_sinh() { return this._ngay_sinh; }
    set ngay_sinh(v: string) { this._ngay_sinh = v; }
    get role_id() { return this._role_id; }
    set role_id(v: string) { this._role_id = v; }
}