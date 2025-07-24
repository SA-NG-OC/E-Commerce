import { BienTheSPModel } from './BienTheSPModel';
import { HinhAnhSPModel } from './HinhAnhSPModel';

export class SanPham {
    private _id: string;
    private _ten_san_pham: string;
    private _ma_san_pham: string;
    private _gia_ban: number;
    private _danh_muc?: string | null;
    private _thuong_hieu?: string | null;
    private _mo_ta?: string | null;
    private _danh_sach_bien_the: BienTheSPModel[] = [];
    private _danh_sach_hinh_anh: HinhAnhSPModel[] = [];

    constructor(data: {
        id?: string;
        ten_san_pham: string;
        ma_san_pham: string;
        gia_ban: number;
        danh_muc?: string | null;
        thuong_hieu?: string | null;
        mo_ta?: string | null;
        danh_sach_bien_the?: BienTheSPModel[];
        danh_sach_hinh_anh?: HinhAnhSPModel[];
    }) {
        this._id = data.id ?? '';
        this._ten_san_pham = data.ten_san_pham;
        this._ma_san_pham = data.ma_san_pham;
        this._gia_ban = data.gia_ban;
        this._danh_muc = data.danh_muc ?? null;
        this._thuong_hieu = data.thuong_hieu ?? null;
        this._mo_ta = data.mo_ta ?? null;
        this._danh_sach_bien_the = data.danh_sach_bien_the ?? [];
        this._danh_sach_hinh_anh = data.danh_sach_hinh_anh ?? [];
    }

    get id(): string {
        return this._id;
    }
    set id(value: string) {
        this._id = value;
    }

    get ten_san_pham(): string {
        return this._ten_san_pham;
    }
    set ten_san_pham(value: string) {
        this._ten_san_pham = value;
    }

    get ma_san_pham(): string {
        return this._ma_san_pham;
    }
    set ma_san_pham(value: string) {
        this._ma_san_pham = value;
    }

    get gia_ban(): number {
        return this._gia_ban;
    }
    set gia_ban(value: number) {
        this._gia_ban = value;
    }

    get danh_muc(): string | null | undefined {
        return this._danh_muc;
    }
    set danh_muc(value: string | null | undefined) {
        this._danh_muc = value;
    }

    get thuong_hieu(): string | null | undefined {
        return this._thuong_hieu;
    }
    set thuong_hieu(value: string | null | undefined) {
        this._thuong_hieu = value;
    }

    get mo_ta(): string | null | undefined {
        return this._mo_ta;
    }
    set mo_ta(value: string | null | undefined) {
        this._mo_ta = value;
    }

    get danh_sach_bien_the(): BienTheSPModel[] {
        return this._danh_sach_bien_the;
    }
    set danh_sach_bien_the(value: BienTheSPModel[]) {
        this._danh_sach_bien_the = value;
    }

    get danh_sach_hinh_anh(): HinhAnhSPModel[] {
        return this._danh_sach_hinh_anh;
    }
    set danh_sach_hinh_anh(value: HinhAnhSPModel[]) {
        this._danh_sach_hinh_anh = value;
    }
}
