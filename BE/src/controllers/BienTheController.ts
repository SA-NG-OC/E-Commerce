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
    // GET /api/bien-the/san-pham/:sanPhamId
    static async getByProductId(req: Request, res: Response): Promise<void> {
        const { sanPhamId } = req.params;

        try {
            const bienThes = await BienTheService.getByProductId(sanPhamId);
            res.status(200).json(bienThes);
        } catch (error) {
            console.error('Lỗi controller - getByProductId:', error);
            res.status(500).json({ message: 'Lỗi server khi lấy biến thể theo sản phẩm ID' });
        }
    }

    // POST /api/bien-the/
    static async createVariant(req: Request, res: Response): Promise<void> {
        const { sanPhamId, tenMau, soKichCo, soLuongTonKho } = req.body;

        try {
            if (!sanPhamId || !tenMau || !soKichCo || soLuongTonKho == null) {
                res.status(400).json({ message: 'Thiếu thông tin tạo biến thể' });
                return;
            }

            await BienTheService.createVariantByNames(sanPhamId, tenMau, soKichCo, soLuongTonKho);
            res.status(201).json({ message: 'Tạo biến thể thành công' });
        } catch (error) {
            console.error('Lỗi controller - createVariant:', error);
            res.status(500).json({ message: 'Lỗi server khi tạo biến thể' });
        }
    }

    // PUT /api/bien-the/:id
    static async updateSoLuong(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { so_luong_ton_kho } = req.body;

            if (!id || typeof so_luong_ton_kho !== 'number') {
                return res.status(400).json({ success: false, message: 'Thiếu id hoặc số lượng hợp lệ' });
            }

            const success = await BienTheService.updateSoLuongTonKho(id, so_luong_ton_kho);

            if (success) {
                return res.status(200).json({ success: true, message: 'Cập nhật số lượng thành công' });
            } else {
                return res.status(404).json({ success: false, message: 'Không tìm thấy biến thể để cập nhật' });
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật số lượng tồn kho:', error);
            return res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }

    static async deleteBienThe(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const success = await BienTheService.deleteBienThe(id);
            if (success) {
                return res.status(200).json({ message: 'Xóa biến thể thành công.' });
            } else {
                return res.status(404).json({ message: 'Không tìm thấy biến thể để xóa.' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server khi xóa biến thể.' });
        }
    }

    // sử dụng api http://localhost:3000/api/bien-the/:id/soft-delete
    static async deleteBienTheAo(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const success = await BienTheService.deleteBienTheAo(id);
            if (success) {
                return res.status(200).json({ message: 'Xóa ảo biến thể thành công.' });
            } else {
                return res.status(404).json({ message: 'Không tìm thấy biến thể để xóa ảo.' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server khi xóa ảo biến thể.' });
        }
    }


    // GET /api/bien-the/:id
    static async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ success: false, message: 'Thiếu ID biến thể' });
            }

            const bienThe = await BienTheService.getById(id);

            if (!bienThe) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy biến thể' });
            }

            return res.status(200).json({
                success: true,
                data: {
                    id: bienThe.id,
                    san_pham_id: bienThe.san_pham_id,
                    mau_sac_id: bienThe.mau_sac_id,
                    kich_co_id: bienThe.kich_co_id,
                    so_luong_ton_kho: bienThe.so_luong_ton_kho,
                }
            });

        } catch (error) {
            console.error('Lỗi khi lấy biến thể theo ID:', error);
            return res.status(500).json({ success: false, message: 'Lỗi server' });
        }
    }

}