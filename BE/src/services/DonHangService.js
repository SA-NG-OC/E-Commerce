"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonHangService = void 0;
const db_1 = __importDefault(require("../config/db"));
const DonHangModel_1 = require("../models/DonHangModel");
class DonHangService {
    getDonHangByNguoiDungId(nguoi_dung_id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = `
            SELECT 
                dh.id AS don_hang_id,
                dh.nguoi_dung_id,
                dh.tong_thanh_toan,
                dh.trang_thai,
                dh.ngay_tao,

                sp.ten_san_pham,
                sp.id AS san_pham_id,
                bts.id AS bien_the_id,
                ct.gia_ban,
                ms.ten_mau AS mau_sac,
                kc.so_kich_co AS kich_co,
                hasp.duong_dan_hinh_anh AS hinh_anh_bien_the,
                ct.so_luong

            FROM don_hang dh
            JOIN chi_tiet_don_hang ct ON ct.don_hang_id = dh.id
            JOIN bien_the_san_pham bts ON ct.bien_the_id = bts.id
            JOIN san_pham sp ON sp.id = bts.san_pham_id
            JOIN mau_sac ms ON ms.id = bts.mau_sac_id
            JOIN kich_co kc ON kc.id = bts.kich_co_id

            LEFT JOIN (
                SELECT 
                    san_pham_id, 
                    mau_sac_id, 
                    duong_dan_hinh_anh
                FROM (
                    SELECT *, 
                        ROW_NUMBER() OVER (
                            PARTITION BY san_pham_id, mau_sac_id 
                            ORDER BY id
                        ) AS rn
                    FROM hinh_anh_san_pham
                ) AS ranked
                WHERE rn = 1
            ) AS hasp 
                ON hasp.san_pham_id = sp.id 
                AND hasp.mau_sac_id = bts.mau_sac_id

            WHERE dh.nguoi_dung_id = $1
            ORDER BY dh.ngay_tao DESC;
        `;
            const result = yield db_1.default.query(query, [nguoi_dung_id]);
            if (result.rows.length === 0)
                return [];
            // Nhóm theo don_hang_id
            const donHangMap = new Map();
            for (const row of result.rows) {
                const donHangId = row.don_hang_id;
                if (!donHangMap.has(donHangId)) {
                    donHangMap.set(donHangId, new DonHangModel_1.DonHangModel(donHangId, row.nguoi_dung_id, parseFloat(row.tong_thanh_toan), row.trang_thai, row.ngay_tao, [] // Danh sách sản phẩm sẽ được đẩy vào sau
                    ));
                }
                (_a = donHangMap.get(donHangId)) === null || _a === void 0 ? void 0 : _a.san_pham.push({
                    ten_san_pham: row.ten_san_pham,
                    id_san_pham: row.san_pham_id,
                    id_bien_the: row.bien_the_id,
                    gia_ban: parseFloat(row.gia_ban),
                    mau_sac: row.mau_sac,
                    kich_co: row.kich_co,
                    hinh_anh_bien_the: row.hinh_anh_bien_the,
                    so_luong: row.so_luong
                });
            }
            return Array.from(donHangMap.values());
        });
    }
    huyDonHang(don_hang_id, nguoi_dung_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Kiểm tra trạng thái đơn hàng và quyền sở hữu (nếu có nguoi_dung_id)
                let checkQuery = `
            SELECT trang_thai, nguoi_dung_id 
            FROM don_hang 
            WHERE id = $1
        `;
                let checkParams = [don_hang_id];
                if (nguoi_dung_id) {
                    checkQuery += ' AND nguoi_dung_id = $2';
                    checkParams.push(nguoi_dung_id);
                }
                const checkResult = yield client.query(checkQuery, checkParams);
                if (checkResult.rows.length === 0) {
                    yield client.query('ROLLBACK');
                    return {
                        success: false,
                        message: 'Không tìm thấy đơn hàng hoặc bạn không có quyền hủy đơn hàng này'
                    };
                }
                const donHang = checkResult.rows[0];
                if (donHang.trang_thai !== 'cho_xac_nhan') {
                    yield client.query('ROLLBACK');
                    return {
                        success: false,
                        message: 'Chỉ có thể hủy đơn hàng đang ở trạng thái "Chờ xác nhận"'
                    };
                }
                // Cập nhật trạng thái đơn hàng thành 'da_huy'
                yield client.query(`
            UPDATE don_hang 
            SET trang_thai = 'da_huy' 
            WHERE id = $1
        `, [don_hang_id]);
                yield client.query('COMMIT');
                return {
                    success: true,
                    message: 'Đơn hàng đã được hủy thành công'
                };
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Lỗi khi hủy đơn hàng:', error);
                return {
                    success: false,
                    message: 'Có lỗi xảy ra khi hủy đơn hàng'
                };
            }
            finally {
                client.release();
            }
        });
    }
    xoaDonHang(don_hang_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.default.connect();
            try {
                yield client.query('BEGIN');
                const result = yield client.query(`DELETE FROM don_hang WHERE id = $1`, [don_hang_id]);
                if (result.rowCount === 0) {
                    yield client.query('ROLLBACK');
                    return {
                        success: false,
                        message: 'Không tìm thấy đơn hàng để xóa'
                    };
                }
                yield client.query('COMMIT');
                return {
                    success: true,
                    message: 'Đơn hàng đã được xóa thành công'
                };
            }
            catch (error) {
                yield client.query('ROLLBACK');
                console.error('Lỗi khi xóa đơn hàng:', error);
                return {
                    success: false,
                    message: 'Có lỗi xảy ra khi xóa đơn hàng'
                };
            }
            finally {
                client.release();
            }
        });
    }
    createDonHang(nguoi_dung_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Lấy ID lớn nhất hiện tại
                const idResult = yield client.query(`
            SELECT id FROM don_hang 
            WHERE id LIKE 'DH%' 
            ORDER BY id DESC 
            LIMIT 1
        `);
                let newIdNumber = 1;
                if (idResult.rows.length > 0) {
                    const lastId = idResult.rows[0].id; // eg: "DH005"
                    const numPart = parseInt(lastId.replace('DH', '')) || 0;
                    newIdNumber = numPart + 1;
                }
                const newId = `DH${newIdNumber.toString().padStart(3, '0')}`;
                yield client.query(`
            INSERT INTO don_hang(id, nguoi_dung_id, tong_thanh_toan) 
            VALUES ($1, $2, 0)
        `, [newId, nguoi_dung_id]);
                yield client.query('COMMIT');
                return newId;
            }
            catch (err) {
                yield client.query('ROLLBACK');
                console.error('Lỗi khi tạo đơn hàng:', err);
                return null;
            }
            finally {
                client.release();
            }
        });
    }
    addChiTietDonHang(don_hang_id, bien_the_id, so_luong) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield db_1.default.connect();
            try {
                yield client.query('BEGIN');
                // Lấy san_pham_id từ bien_the_san_pham
                const bienTheResult = yield client.query(`
            SELECT san_pham_id 
            FROM bien_the_san_pham 
            WHERE id = $1
        `, [bien_the_id]);
                if (bienTheResult.rows.length === 0) {
                    yield client.query('ROLLBACK');
                    console.error('Không tìm thấy biến thể sản phẩm');
                    return null;
                }
                const san_pham_id = bienTheResult.rows[0].san_pham_id;
                // Lấy giá bán từ bảng san_pham
                const giaResult = yield client.query(`
            SELECT gia_ban 
            FROM san_pham 
            WHERE id = $1
        `, [san_pham_id]);
                if (giaResult.rows.length === 0) {
                    yield client.query('ROLLBACK');
                    console.error('Không tìm thấy sản phẩm tương ứng');
                    return null;
                }
                const gia_ban = parseFloat(giaResult.rows[0].gia_ban);
                // Sinh ID mới cho chi tiết đơn hàng
                const idResult = yield client.query(`
            SELECT id FROM chi_tiet_don_hang 
            WHERE id LIKE 'CTDH%' 
            ORDER BY id DESC 
            LIMIT 1
        `);
                let newIdNumber = 1;
                if (idResult.rows.length > 0) {
                    const lastId = idResult.rows[0].id;
                    const numPart = parseInt(lastId.replace('CTDH', '')) || 0;
                    newIdNumber = numPart + 1;
                }
                const newId = `CTDH${newIdNumber.toString().padStart(3, '0')}`;
                // Thêm chi tiết đơn hàng
                yield client.query(`
            INSERT INTO chi_tiet_don_hang(id, don_hang_id, bien_the_id, so_luong, gia_ban)
            VALUES ($1, $2, $3, $4, $5)
        `, [newId, don_hang_id, bien_the_id, so_luong, gia_ban]);
                // Cập nhật tổng thanh toán đơn hàng
                yield client.query(`
            UPDATE don_hang 
            SET tong_thanh_toan = tong_thanh_toan + $1 
            WHERE id = $2
        `, [gia_ban * so_luong, don_hang_id]);
                yield client.query('COMMIT');
                return newId;
            }
            catch (err) {
                yield client.query('ROLLBACK');
                console.error('Lỗi khi thêm chi tiết đơn hàng:', err);
                return null;
            }
            finally {
                client.release();
            }
        });
    }
}
exports.DonHangService = DonHangService;
