export class KichCoModel {
    private id: string;
    private _so_Kich_Co: string;

    constructor(id: string, so_Kich_Co: string) {
        this.id = id;
        this._so_Kich_Co = so_Kich_Co;
    }

    get so_Kich_Co(): string {
        return this._so_Kich_Co;
    }

    set so_Kich_Co(value: string) {
        this._so_Kich_Co = value;
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }
}