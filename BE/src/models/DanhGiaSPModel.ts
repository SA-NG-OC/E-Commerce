export class DanhGiaSPModel {
    private _id: number;
    private _san_pham_id: number;
    private _nguoi_dung_id: number;
    private _diem_danh_gia: number;
    private _noi_dung_danh_gia: string;
    private _ngay_tao: Date;
    private _ho_ten_nguoi_dung?: string;

    constructor(data: {
        id: number;
        san_pham_id: number;
        nguoi_dung_id: number;
        diem_danh_gia: number;
        noi_dung_danh_gia: string;
        ngay_tao: Date | string;
        ho_ten_nguoi_dung?: string;
    }) {
        this._id = data.id;
        this._san_pham_id = data.san_pham_id;
        this._nguoi_dung_id = data.nguoi_dung_id;
        this._diem_danh_gia = data.diem_danh_gia;
        this._noi_dung_danh_gia = data.noi_dung_danh_gia;
        this._ngay_tao = typeof data.ngay_tao === 'string' ? new Date(data.ngay_tao) : data.ngay_tao;
        this._ho_ten_nguoi_dung = data.ho_ten_nguoi_dung;
    }

    get id(): number { return this._id; }
    set id(value: number) { this._id = value; }

    get san_pham_id(): number { return this._san_pham_id; }
    set san_pham_id(value: number) { this._san_pham_id = value; }

    get nguoi_dung_id(): number { return this._nguoi_dung_id; }
    set nguoi_dung_id(value: number) { this._nguoi_dung_id = value; }

    get diem_danh_gia(): number { return this._diem_danh_gia; }
    set diem_danh_gia(value: number) { this._diem_danh_gia = value; }

    get noi_dung_danh_gia(): string { return this._noi_dung_danh_gia; }
    set noi_dung_danh_gia(value: string) { this._noi_dung_danh_gia = value; }

    get ngay_tao(): Date { return this._ngay_tao; }
    set ngay_tao(value: Date) { this._ngay_tao = value; }

    get ho_ten_nguoi_dung(): string | undefined { return this._ho_ten_nguoi_dung; }
    set ho_ten_nguoi_dung(value: string | undefined) { this._ho_ten_nguoi_dung = value; }
}
