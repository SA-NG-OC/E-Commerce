// controllers/ThongBaoController.ts
import { Request, Response } from 'express';
import { ThongBaoService } from '../services/ThongBaoService';
import { Server } from 'socket.io';

export class ThongBaoController {
    private thongBaoService: ThongBaoService;

    // Nhận io từ ngoài truyền vào
    constructor(io: Server) {
        this.thongBaoService = new ThongBaoService(io);
    }

    guiThongBao = async (req: Request, res: Response) => {
        try {
            const { nguoi_dung_id, tieu_de, noi_dung } = req.body;
            if (!nguoi_dung_id || !tieu_de || !noi_dung) {
                return res.status(400).json({ message: 'Thiếu dữ liệu gửi thông báo' });
            }

            const thongBao = await this.thongBaoService.guiThongBao(
                nguoi_dung_id,
                tieu_de,
                noi_dung
            );

            res.status(201).json({
                message: 'Gửi thông báo thành công',
                data: thongBao.toObject()
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    };

    layThongBaoNguoiDung = async (req: Request, res: Response) => {
        try {
            const { nguoi_dung_id } = req.params;
            if (!nguoi_dung_id) {
                return res.status(400).json({ message: 'Thiếu ID người dùng' });
            }

            const danhSach = await this.thongBaoService.layThongBaoNguoiDung(nguoi_dung_id);
            res.json(danhSach.map(tb => tb.toObject()));
        } catch (error: any) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    };

    markAllAsRead = async (req: Request, res: Response) => {
        try {
            const { nguoi_dung_id } = req.params;
            if (!nguoi_dung_id) {
                return res.status(400).json({ message: 'Thiếu ID người dùng' });
            }

            const result = await this.thongBaoService.markAllAsRead(nguoi_dung_id);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    };

    markAsRead = async (req: Request, res: Response) => {
        try {
            const { thong_bao_id } = req.params;
            if (!thong_bao_id) {
                return res.status(400).json({ message: 'Thiếu ID thông báo' });
            }

            const result = await this.thongBaoService.markAsRead(thong_bao_id);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    };

    deleteThongBao = async (req: Request, res: Response) => {
        try {
            const { thong_bao_id } = req.params;
            if (!thong_bao_id) {
                return res.status(400).json({ message: 'Thiếu ID thông báo' });
            }

            const result = await this.thongBaoService.deleteThongBao(thong_bao_id);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    };


}
