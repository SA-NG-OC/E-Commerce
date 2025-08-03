// controllers/thanhToanController.ts
import { Request, Response } from 'express';
import { getThanhToanSP } from '../services/ThanhToanSPService';
//Sử dụng api: http://localhost:3000/api/thanh-toan/:bienTheId/:soLuong
export const getThanhToanSPController = async (req: Request, res: Response) => {
    try {
        const bienTheId = req.params.bienTheId;
        const soLuong = parseInt(req.params.soLuong);

        if (!bienTheId || isNaN(soLuong)) {
            return res.status(400).json({ message: 'Invalid input' });
        }

        const model = await getThanhToanSP(bienTheId, soLuong);
        if (!model) {
            return res.status(404).json({ message: 'Không tìm thấy biến thể' });
        }

        res.status(200).json(model);
    } catch (err) {
        console.error('Error in getThanhToanSPController:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
