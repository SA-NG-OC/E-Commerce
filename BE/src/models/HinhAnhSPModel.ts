export class HinhAnhSPModel {
    private _id: number;
    private _san_pham_id: number;
    private _duong_dan_hinh_anh: string;

    constructor(id: number, san_pham_id: number, duong_dan_hinh_anh: string) {
        this._id = id;
        this._san_pham_id = san_pham_id;
        this._duong_dan_hinh_anh = duong_dan_hinh_anh;
    }

    get id(): number {
        return this._id;
    }
    set id(value: number) {
        this._id = value;
    }

    get san_pham_id(): number {
        return this._san_pham_id;
    }
    set san_pham_id(value: number) {
        this._san_pham_id = value;
    }

    get duong_dan_hinh_anh(): string {
        return this._duong_dan_hinh_anh;
    }
    set duong_dan_hinh_anh(value: string) {
        this._duong_dan_hinh_anh = value;
    }
}
