export class DonHangModel {
    private _id: string;
    private _nguoi_dung_id: string;
    private _tong_thanh_toan: number;
    private _trang_thai: string;
    private _ngay_tao: string;

    private _san_pham: {
        ten_san_pham: string;
        id_san_pham: string;
        id_bien_the: string;
        gia_ban: number;
        mau_sac: string;
        kich_co: string;
        hinh_anh_bien_the: string;
        so_luong: number;
    }[];

    constructor(
        id: string,
        nguoi_dung_id: string,
        tong_thanh_toan: number,
        trang_thai: string,
        ngay_tao: string,
        san_pham: {
            ten_san_pham: string;
            id_san_pham: string;
            id_bien_the: string;
            gia_ban: number;
            mau_sac: string;
            kich_co: string;
            hinh_anh_bien_the: string;
            so_luong: number;
        }[]
    ) {
        this._id = id;
        this._nguoi_dung_id = nguoi_dung_id;
        this._tong_thanh_toan = tong_thanh_toan;
        this._trang_thai = trang_thai;
        this._ngay_tao = ngay_tao;
        this._san_pham = san_pham;
    }

    // Getters and Setters
    get id(): string {
        return this._id;
    }
    set id(value: string) {
        this._id = value;
    }

    get nguoi_dung_id(): string {
        return this._nguoi_dung_id;
    }
    set nguoi_dung_id(value: string) {
        this._nguoi_dung_id = value;
    }

    get tong_thanh_toan(): number {
        return this._tong_thanh_toan;
    }
    set tong_thanh_toan(value: number) {
        this._tong_thanh_toan = value;
    }

    get trang_thai(): string {
        return this._trang_thai;
    }
    set trang_thai(value: string) {
        this._trang_thai = value;
    }

    get ngay_tao(): string {
        return this._ngay_tao;
    }
    set ngay_tao(value: string) {
        this._ngay_tao = value;
    }

    get san_pham(): {
        ten_san_pham: string;
        id_san_pham: string;
        id_bien_the: string;
        gia_ban: number;
        mau_sac: string;
        kich_co: string;
        hinh_anh_bien_the: string;
        so_luong: number;
    }[] {
        return this._san_pham;
    }
    set san_pham(value: {
        ten_san_pham: string;
        id_san_pham: string;
        id_bien_the: string;
        gia_ban: number;
        mau_sac: string;
        kich_co: string;
        hinh_anh_bien_the: string;
        so_luong: number;
    }[]) {
        this._san_pham = value;
    }
}
