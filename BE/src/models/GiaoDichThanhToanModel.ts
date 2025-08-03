export type TrangThaiGiaoDich =
    | 'cho_thanh_toan'
    | 'da_thanh_toan'
    | 'that_bai'
    | 'hoan_tien';

export class GiaoDichThanhToanModel {
    private _id: string;
    private _don_hang_id: string;
    private _phuong_thuc_thanh_toan: string; // 'COD', 'Chuyển khoản', v.v.
    private _so_tien: number;
    private _trang_thai: TrangThaiGiaoDich;
    private _ma_giao_dich: string | null;
    private _ngay_thanh_toan: Date | null; // ISO format hoặc null
    private _ghi_chu: string | null;

    constructor(data: {
        id?: string;
        don_hang_id: string;
        phuong_thuc_thanh_toan: string;
        so_tien: number;
        trang_thai?: TrangThaiGiaoDich;
        ma_giao_dich?: string | null;
        ngay_thanh_toan?: Date | null;
        ghi_chu?: string | null;
    }) {
        this._id = data.id ?? '';
        this._don_hang_id = data.don_hang_id;
        this._phuong_thuc_thanh_toan = data.phuong_thuc_thanh_toan;
        this._so_tien = data.so_tien;
        this._trang_thai = data.trang_thai ?? 'cho_thanh_toan';
        this._ma_giao_dich = data.ma_giao_dich ?? null;
        this._ngay_thanh_toan = data.ngay_thanh_toan ?? null;
        this._ghi_chu = data.ghi_chu ?? null;
    }

    get id(): string {
        return this._id;
    }
    set id(value: string) {
        this._id = value;
    }

    get don_hang_id(): string {
        return this._don_hang_id;
    }
    set don_hang_id(value: string) {
        this._don_hang_id = value;
    }

    get phuong_thuc_thanh_toan(): string {
        return this._phuong_thuc_thanh_toan;
    }
    set phuong_thuc_thanh_toan(value: string) {
        this._phuong_thuc_thanh_toan = value;
    }

    get so_tien(): number {
        return this._so_tien;
    }
    set so_tien(value: number) {
        this._so_tien = value;
    }

    get trang_thai(): TrangThaiGiaoDich {
        return this._trang_thai;
    }
    set trang_thai(value: TrangThaiGiaoDich) {
        this._trang_thai = value;
    }

    get ma_giao_dich(): string | null {
        return this._ma_giao_dich;
    }
    set ma_giao_dich(value: string | null) {
        this._ma_giao_dich = value;
    }

    get ngay_thanh_toan(): Date | null {
        return this._ngay_thanh_toan;
    }
    set ngay_thanh_toan(value: Date | null) {
        this._ngay_thanh_toan = value;
    }

    get ghi_chu(): string | null {
        return this._ghi_chu;
    }
    set ghi_chu(value: string | null) {
        this._ghi_chu = value;
    }
}
