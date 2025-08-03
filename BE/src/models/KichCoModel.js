"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KichCoModel = void 0;
class KichCoModel {
    constructor(id, so_Kich_Co) {
        this.id = id;
        this._so_Kich_Co = so_Kich_Co;
    }
    get so_Kich_Co() {
        return this._so_Kich_Co;
    }
    set so_Kich_Co(value) {
        this._so_Kich_Co = value;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
}
exports.KichCoModel = KichCoModel;
