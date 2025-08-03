export class ThanhToanSPModel {
    private _bien_the_id: string;
    private _ten_san_pham: string;
    private _so_luong: number;
    private _don_gia: number;
    private _mau_sac: string;
    private _kich_co: string;
    private _duong_dan_hinh_anh: string;

    constructor(data: {
        bien_the_id: string;
        ten_san_pham: string;
        so_luong: number;
        don_gia: number;
        mau_sac: string;
        kich_co: string;
        duong_dan_hinh_anh: string;
    }) {
        this._bien_the_id = data.bien_the_id;
        this._ten_san_pham = data.ten_san_pham;
        this._so_luong = data.so_luong;
        this._don_gia = data.don_gia;
        this._mau_sac = data.mau_sac;
        this._kich_co = data.kich_co;
        this._duong_dan_hinh_anh = data.duong_dan_hinh_anh;
    }
    get bien_the_id(): string {
        return this._bien_the_id;
    }
    set bien_the_id(value: string) {
        this._bien_the_id = value;
    }
    get ten_san_pham(): string {
        return this._ten_san_pham;
    }
    set ten_san_pham(value: string) {
        this._ten_san_pham = value;
    }
    get so_luong(): number {
        return this._so_luong;
    }
    set so_luong(value: number) {
        this._so_luong = value;
    }
    get don_gia(): number {
        return this._don_gia;
    }
    set don_gia(value: number) {
        this._don_gia = value;
    }
    get mau_sac(): string {
        return this._mau_sac;
    }
    set mau_sac(value: string) {
        this._mau_sac = value;
    }
    get kich_co(): string {
        return this._kich_co;
    }
    set kich_co(value: string) {
        this._kich_co = value;
    }
    get duong_dan_hinh_anh(): string {
        return this._duong_dan_hinh_anh;
    }
    set duong_dan_hinh_anh(value: string) {
        this._duong_dan_hinh_anh = value;
    }

}
