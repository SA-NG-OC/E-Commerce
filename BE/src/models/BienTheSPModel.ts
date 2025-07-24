export class BienTheSPModel {
    private _id: string;
    private _san_pham_id: string;
    private _mau_sac_id: string;
    private _kich_co_id: string;
    private _so_luong_ton_kho: number;

    constructor(data: {
        id?: string;
        san_pham_id: string;
        mau_sac_id: string;
        kich_co_id: string;
        so_luong_ton_kho: number;
    }) {
        this._id = data.id ?? '';
        this._san_pham_id = data.san_pham_id;
        this._mau_sac_id = data.mau_sac_id;
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
