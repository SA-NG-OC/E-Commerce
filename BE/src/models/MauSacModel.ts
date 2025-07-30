export class MauSacModel {
    private id: string;
    private _ten_Mau_Sac: string;
    private _ma_Mau: string;


    constructor(id: string, ten_Mau_Sac: string, ma_Mau: string) {
        this.id = id;
        this._ten_Mau_Sac = ten_Mau_Sac;
        this._ma_Mau = ma_Mau;
    }

    get ten_Mau_Sac(): string {
        return this._ten_Mau_Sac;
    }

    set ten_Mau_Sac(value: string) {
        this._ten_Mau_Sac = value;
    }

    get ma_Mau(): string {
        return this._ma_Mau;
    }

    set ma_Mau(value: string) {
        this._ma_Mau = value;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

}