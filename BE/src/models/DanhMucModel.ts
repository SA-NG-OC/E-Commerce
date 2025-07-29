import { SanPham } from './SanPhamModel'; // đảm bảo bạn đã import đúng

export class DanhMucModel {
    private _id: string;
    private _ten_danh_muc: string;
    private _icon: string;
    private _san_phams: SanPham[] = [];

    constructor(id: string, ten_danh_muc: string, icon: string, san_phams: SanPham[] = []) {
        this._id = id;
        this._ten_danh_muc = ten_danh_muc;
        this._icon = icon;
        this._san_phams = san_phams;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get ten_danh_muc(): string {
        return this._ten_danh_muc;
    }

    set ten_danh_muc(value: string) {
        this._ten_danh_muc = value;
    }

    get icon(): string {
        return this._icon;
    }

    set icon(value: string) {
        this._icon = value;
    }

    get san_phams(): SanPham[] {
        return this._san_phams;
    }

    set san_phams(value: SanPham[]) {
        this._san_phams = value;
    }
}
