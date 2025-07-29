import { SanPham } from './SanPhamModel';

export class ThuongHieuModel {
    private _id: string;
    private _ten_thuong_hieu: string;
    private _san_phams: SanPham[] = [];

    constructor(data: { id: string; ten_thuong_hieu: string; san_phams?: SanPham[] }) {
        this._id = data.id;
        this._ten_thuong_hieu = data.ten_thuong_hieu;
        this._san_phams = data.san_phams ?? [];
    }

    get id(): string {
        return this._id;
    }

    get ten_thuong_hieu(): string {
        return this._ten_thuong_hieu;
    }

    get san_phams(): SanPham[] {
        return this._san_phams;
    }

    set san_phams(value: SanPham[]) {
        this._san_phams = value;
    }
}
