export class GioHangModel {
    private _id: string;
    private _nguoi_dung_id: string;

    private _san_pham: {
        ten_san_pham: string;
        id_san_pham: string;
        id_bien_the: string;
        gia_ban: number;
        so_luong_ton: number;
        mau_sac: string;
        kich_co: string;
        hinh_anh_bien_the: string;
        so_luong: number;
    }[];

    constructor(
        id: string,
        nguoi_dung_id: string,
        san_pham: {
            ten_san_pham: string;
            id_san_pham: string;
            id_bien_the: string;
            gia_ban: number;
            so_luong_ton: number;
            mau_sac: string;
            kich_co: string;
            hinh_anh_bien_the: string;
            so_luong: number;
        }[] = []
    ) {
        this._id = id;
        this._nguoi_dung_id = nguoi_dung_id;
        this._san_pham = san_pham;
    }

    get id(): string {
        return this._id;
    }

    get nguoi_dung_id(): string {
        return this._nguoi_dung_id;
    }

    get san_pham(): {
        ten_san_pham: string;
        id_san_pham: string;
        id_bien_the: string;
        gia_ban: number;
        so_luong_ton: number;
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
        so_luong_ton: number;
        mau_sac: string;
        kich_co: string;
        hinh_anh_bien_the: string;
        so_luong: number;
    }[]) {
        this._san_pham = value;
    }

    // Xóa sản phẩm khỏi giỏ theo id_bien_the
    xoaSanPham(id_bien_the: string) {
        this._san_pham = this._san_pham.filter(item => item.id_bien_the !== id_bien_the);
    }

    // Cập nhật số lượng theo id_bien_the
    capNhatSoLuong(id_bien_the: string, so_luong: number) {
        const item = this._san_pham.find(item => item.id_bien_the === id_bien_the);
        if (item) {
            item.so_luong = so_luong;
        }
    }

    // Tổng số lượng sản phẩm trong giỏ
    tongSoLuong(): number {
        return this._san_pham.reduce((sum, item) => sum + item.so_luong, 0);
    }

    // Tổng giá trị giỏ hàng dựa trên trường gia_ban
    tongGiaTri(): number {
        return this._san_pham.reduce((sum, item) => sum + item.gia_ban * item.so_luong, 0);
    }
}
