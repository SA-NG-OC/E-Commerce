// ===================== MODELS =====================

// models/ThongBaoModel.ts
export class ThongBaoModel {
    private _id: string;
    private _nguoi_dung_id: string;
    private _tieu_de: string;
    private _noi_dung: string;
    private _da_doc: boolean;
    private _ngay_tao: Date;

    constructor(data: {
        id: string;
        nguoi_dung_id: string;
        tieu_de: string;
        noi_dung: string;
        da_doc?: boolean;
        ngay_tao?: Date;
    }) {
        this._id = data.id;
        this._nguoi_dung_id = data.nguoi_dung_id;
        this._noi_dung = data.noi_dung;
        this._tieu_de = data.tieu_de;
        this._da_doc = data.da_doc || false;
        this._ngay_tao = data.ngay_tao || new Date();
    }

    // Getters
    getId(): string {
        return this._id;
    }

    getNguoi_dung_id(): string {
        return this._nguoi_dung_id;
    }

    getNoi_dung(): string {
        return this._noi_dung;
    }

    getTieu_de(): string {
        return this._tieu_de;
    }

    getDa_doc(): boolean {
        return this._da_doc;
    }

    getNgay_tao(): Date {
        return this._ngay_tao;
    }

    // Setters
    setId(value: string): void {
        this._id = value;
    }

    setNguoi_dung_id(value: string): void {
        this._nguoi_dung_id = value;
    }

    setNoi_dung(value: string): void {
        this._noi_dung = value;
    }

    setTieu_de(value: string): void {
        this._tieu_de = value;
    }

    setDa_doc(value: boolean): void {
        this._da_doc = value;
    }

    setNgay_tao(value: Date): void {
        this._ngay_tao = value;
    }

    // Convert to plain object for database operations
    toObject() {
        return {
            id: this._id,
            nguoi_dung_id: this._nguoi_dung_id,
            tieu_de: this._tieu_de,
            noi_dung: this._noi_dung,
            da_doc: this._da_doc,
            ngay_tao: this._ngay_tao
        };
    }

    // Static method to create from database row
    static fromDatabase(row: any): ThongBaoModel {
        return new ThongBaoModel({
            id: row.id,
            nguoi_dung_id: row.nguoi_dung_id,
            tieu_de: row.tieu_de,
            noi_dung: row.noi_dung,
            da_doc: row.da_doc,
            ngay_tao: row.ngay_tao
        });
    }
}