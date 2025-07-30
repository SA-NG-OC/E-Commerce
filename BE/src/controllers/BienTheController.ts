import { BienTheSPModel } from "../models/BienTheSPModel";
import { BienTheService } from "../services/BienTheService";
import { Request, Response } from "express";

export class BienTheController {
    // Sử dụng api http://localhost:3000/api/bien-the/:mauSacId/:kichCoId/:sanPhamId
    static async checkExist(req: Request, res: Response) {
        try {
            const { mauSacId, kichCoId, sanPhamId } = req.params;
            const bienTheList: (BienTheSPModel | null) = await BienTheService.checkExist(mauSacId, kichCoId, sanPhamId);
            return res.status(200).json(bienTheList);
        } catch (error) {
            console.error("Error fetching all Bien The:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}