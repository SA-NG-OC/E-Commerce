export class BienTheSPModel {
    private _id: string;
    private _san_pham_id: string;
    private _mau_sac_id: string;
    private _mau_sac: string;
    private _ma_mau: string;
    private _kich_co: string;
    private _kich_co_id: string;
    private _so_luong_ton_kho: number;

    constructor(data: {
        id: string;
        san_pham_id: string;
        mau_sac_id: string;
        mau_sac: string;
        ma_mau: string;
        kich_co: string;
        kich_co_id: string;
        so_luong_ton_kho: number;
    }) {
        this._id = data.id;
        this._san_pham_id = data.san_pham_id;
        this._mau_sac_id = data.mau_sac_id;
        this._mau_sac = data.mau_sac;
        this._ma_mau = data.ma_mau;
        this._kich_co = data.kich_co;
        this._kich_co_id = data.kich_co_id;
        this._so_luong_ton_kho = data.so_luong_ton_kho;
    }

    get id(): string {
        return this._id;
    }
    set id(value: string) {
        this._id = value;
    }

    get san_pham_id(): string {
        return this._san_pham_id;
    }
    set san_pham_id(value: string) {
        this._san_pham_id = value;
    }

    get mau_sac_id(): string {
        return this._mau_sac_id;
    }
    set mau_sac_id(value: string) {
        this._mau_sac_id = value;
    }

    get mau_sac(): string {
        return this._mau_sac;
    }
    set mau_sac(value: string) {
        this._mau_sac = value;
    }

    get ma_mau(): string {
        return this._ma_mau;
    }
    set ma_mau(value: string) {
        this._ma_mau = value;
    }

    get kich_co(): string {
        return this._kich_co;
    }
    set kich_co(value: string) {
        this._kich_co = value;
    }

    get kich_co_id(): string {
        return this._kich_co_id;
    }
    set kich_co_id(value: string) {
        this._kich_co_id = value;
    }

    get so_luong_ton_kho(): number {
        return this._so_luong_ton_kho;
    }
    set so_luong_ton_kho(value: number) {
        this._so_luong_ton_kho = value;
    }
}
