export class DiaChiGiaoHangModel {
    private _id: string;
    private _don_hang_id: string;
    private _ho_ten_nguoi_nhan: string;
    private _so_dien_thoai: string;
    private _dia_chi_chi_tiet: string;
    private _phuong_xa: string | null;
    private _tinh_thanh: string | null;
    private _ghi_chu: string | null;

    constructor(data: {
        id?: string;
        don_hang_id: string;
        ho_ten_nguoi_nhan: string;
        so_dien_thoai: string;
        dia_chi_chi_tiet: string;
        phuong_xa?: string | null;
        tinh_thanh?: string | null;
        ghi_chu?: string | null;
    }) {
        this._id = data.id ?? '';
        this._don_hang_id = data.don_hang_id;
        this._ho_ten_nguoi_nhan = data.ho_ten_nguoi_nhan;
        this._so_dien_thoai = data.so_dien_thoai;
        this._dia_chi_chi_tiet = data.dia_chi_chi_tiet;
        this._phuong_xa = data.phuong_xa ?? null;
        this._tinh_thanh = data.tinh_thanh ?? null;
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

    get ho_ten_nguoi_nhan(): string {
        return this._ho_ten_nguoi_nhan;
    }
    set ho_ten_nguoi_nhan(value: string) {
        this._ho_ten_nguoi_nhan = value;
    }

    get so_dien_thoai(): string {
        return this._so_dien_thoai;
    }
    set so_dien_thoai(value: string) {
        this._so_dien_thoai = value;
    }

    get dia_chi_chi_tiet(): string {
        return this._dia_chi_chi_tiet;
    }
    set dia_chi_chi_tiet(value: string) {
        this._dia_chi_chi_tiet = value;
    }

    get phuong_xa(): string | null {
        return this._phuong_xa;
    }
    set phuong_xa(value: string | null) {
        this._phuong_xa = value;
    }

    get tinh_thanh(): string | null {
        return this._tinh_thanh;
    }
    set tinh_thanh(value: string | null) {
        this._tinh_thanh = value;
    }

    get ghi_chu(): string | null {
        return this._ghi_chu;
    }
    set ghi_chu(value: string | null) {
        this._ghi_chu = value;
    }
}
