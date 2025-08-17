// services/ThongBaoService.ts
import pool from '../config/db';
import { ThongBaoModel } from '../models/ThongBaoModel';
import { Server } from 'socket.io';

let io: Server | null = null;

export function setSocketInstance(socketIo: Server) {
    io = socketIo;
}

export class ThongBaoService {
    private io: Server;

    constructor(socketIo: Server) {
        this.io = socketIo;
    }

    async guiThongBao(nguoiDungId: string, tieuDe: string, noiDung: string) {
        // Lấy id lớn nhất hiện tại
        const maxIdQuery = `SELECT MAX(id) AS max_id FROM thong_bao`;
        const maxIdResult = await pool.query(maxIdQuery);
        const maxId = maxIdResult.rows[0]?.max_id || null;

        let newIdNumber = 1;
        if (maxId) {
            // Tách số từ chuỗi "TBxxx"
            const currentNum = parseInt(maxId.replace("TB", ""), 10);
            newIdNumber = currentNum + 1;
        }

        // Format lại thành TBxxx (đệm số 0 nếu cần)
        const newId = `TB${String(newIdNumber).padStart(3, "0")}`;

        const thongBao = new ThongBaoModel({
            id: newId,
            nguoi_dung_id: nguoiDungId,
            tieu_de: tieuDe,
            noi_dung: noiDung
        });

        const data = thongBao.toObject();
        const query = `
            INSERT INTO thong_bao (id, nguoi_dung_id, tieu_de, noi_dung, da_doc, ngay_tao)
            VALUES ($1, $2, $3, $4, $5, $6)
        `;

        await pool.query(query, [
            data.id,
            data.nguoi_dung_id,
            data.tieu_de,
            data.noi_dung,
            data.da_doc,
            data.ngay_tao
        ]);

        // Sử dụng instance từ constructor (ưu tiên) hoặc global variable
        const socketInstance = this.io || io;
        if (socketInstance) {
            socketInstance.to(nguoiDungId).emit('thong-bao-moi', data);
        } else {
            console.warn('Socket.IO instance not available');
        }

        return thongBao;
    }

    // ... các method khác giữ nguyên
    async layThongBaoNguoiDung(nguoiDungId: string) {
        const result = await pool.query(
            `SELECT * FROM thong_bao WHERE nguoi_dung_id = $1 ORDER BY ngay_tao DESC`,
            [nguoiDungId]
        );
        return result.rows.map(row => ThongBaoModel.fromDatabase(row));
    }

    async markAllAsRead(nguoiDungId: string) {
        const query = `
        UPDATE thong_bao
        SET da_doc = true
        WHERE nguoi_dung_id = $1
    `;
        await pool.query(query, [nguoiDungId]);
        return { message: "Đã đánh dấu tất cả thông báo là đã đọc" };
    }

    async markAsRead(thongBaoId: string) {
        const query = `
        UPDATE thong_bao
        SET da_doc = true
        WHERE id = $1
    `;
        await pool.query(query, [thongBaoId]);
        return { message: `Thông báo ${thongBaoId} đã được đánh dấu là đã đọc` };
    }

    async deleteThongBao(thongBaoId: string) {
        const query = `
        DELETE FROM thong_bao
        WHERE id = $1
    `;
        await pool.query(query, [thongBaoId]);
        return { message: `Thông báo ${thongBaoId} đã được xóa` };
    }
}