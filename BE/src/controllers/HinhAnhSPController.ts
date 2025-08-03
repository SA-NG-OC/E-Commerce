import { Request, Response } from 'express';
import { HinhAnhSPService } from '../services/HinhAnhSPService';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/products');
        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Tạo tên file unique: productId_mauId_timestamp.ext
        const { productId, mauId } = req.body;
        const ext = path.extname(file.originalname);
        const filename = `${productId}_${mauId}_${Date.now()}${ext}`;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)'));
        }
    }
});

export class HinhAnhSPController {

    // GET /api/hinh-anh-sp/san-pham/:productId
    static async getByProductId(req: Request, res: Response) {
        try {
            const { productId } = req.params;

            if (!productId) {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu productId'
                });
            }

            const images = await HinhAnhSPService.getByProductId(productId);

            return res.status(200).json({
                success: true,
                data: images
            });
        } catch (error) {
            console.error('Lỗi khi lấy ảnh sản phẩm:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    }

    // POST /api/hinh-anh-sp/upload
    static uploadImages = [
        upload.array('images', 10), // Tối đa 10 ảnh
        async (req: Request, res: Response) => {
            try {
                const { productId, mauId } = req.body;
                const files = req.files as Express.Multer.File[];

                if (!productId || !mauId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Thiếu productId hoặc mauId'
                    });
                }

                if (!files || files.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'Không có file nào được upload'
                    });
                }

                const results = [];

                for (const file of files) {
                    try {
                        // Đường dẫn tương đối để lưu vào DB
                        // Đường dẫn tuyệt đối để lưu vào DB
                        const fullPath = `http://localhost:3000/uploads/products/${file.filename}`;

                        const success = await HinhAnhSPService.create({
                            san_pham_id: productId,
                            mau_sac_id: mauId,
                            duong_dan_hinh_anh: fullPath
                        });

                        if (success) {
                            results.push({
                                filename: file.filename,
                                path: fullPath,
                                status: 'success'
                            });
                        } else {
                            results.push({
                                filename: file.filename,
                                status: 'failed',
                                error: 'Không thể lưu vào database'
                            });
                        }
                    } catch (error) {
                        results.push({
                            filename: file.filename,
                            status: 'failed',
                            error: (error as Error).message
                        });
                    }
                }

                return res.status(200).json({
                    success: true,
                    message: `Upload hoàn tất. Thành công: ${results.filter(r => r.status === 'success').length}/${files.length}`,
                    data: results
                });

            } catch (error) {
                console.error('Lỗi khi upload ảnh:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi server: ' + (error as Error).message
                });
            }
        }
    ];

    // DELETE /api/hinh-anh-sp?duongDan=/uploads/products/abc.jpg
    static async delete(req: Request, res: Response) {
        try {
            const { duongDan } = req.query;

            if (!duongDan || typeof duongDan !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Thiếu hoặc sai đường dẫn hình ảnh'
                });
            }

            const success = await HinhAnhSPService.delete(duongDan);

            if (success) {
                return res.status(200).json({
                    success: true,
                    message: 'Xóa ảnh thành công'
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy ảnh để xóa'
                });
            }
        } catch (error) {
            console.error('Lỗi khi xóa ảnh:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server'
            });
        }
    }

}