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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HinhAnhSPController = void 0;
const HinhAnhSPService_1 = require("../services/HinhAnhSPService");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Cấu hình multer cho upload file
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, '../uploads/products');
        // Tạo thư mục nếu chưa tồn tại
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Tạo tên file unique: productId_mauId_timestamp.ext
        const { productId, mauId } = req.body;
        const ext = path_1.default.extname(file.originalname);
        const filename = `${productId}_${mauId}_${Date.now()}${ext}`;
        cb(null, filename);
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Chỉ chấp nhận file ảnh (jpg, jpeg, png, gif, webp)'));
        }
    }
});
class HinhAnhSPController {
    // GET /api/hinh-anh-sp/san-pham/:productId
    static getByProductId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { productId } = req.params;
                if (!productId) {
                    return res.status(400).json({
                        success: false,
                        message: 'Thiếu productId'
                    });
                }
                const images = yield HinhAnhSPService_1.HinhAnhSPService.getByProductId(productId);
                return res.status(200).json({
                    success: true,
                    data: images
                });
            }
            catch (error) {
                console.error('Lỗi khi lấy ảnh sản phẩm:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi server'
                });
            }
        });
    }
    // DELETE /api/hinh-anh-sp?duongDan=/uploads/products/abc.jpg
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { duongDan } = req.query;
                if (!duongDan || typeof duongDan !== 'string') {
                    return res.status(400).json({
                        success: false,
                        message: 'Thiếu hoặc sai đường dẫn hình ảnh'
                    });
                }
                const success = yield HinhAnhSPService_1.HinhAnhSPService.delete(duongDan);
                if (success) {
                    return res.status(200).json({
                        success: true,
                        message: 'Xóa ảnh thành công'
                    });
                }
                else {
                    return res.status(404).json({
                        success: false,
                        message: 'Không tìm thấy ảnh để xóa'
                    });
                }
            }
            catch (error) {
                console.error('Lỗi khi xóa ảnh:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Lỗi server'
                });
            }
        });
    }
}
exports.HinhAnhSPController = HinhAnhSPController;
_a = HinhAnhSPController;
// POST /api/hinh-anh-sp/upload
HinhAnhSPController.uploadImages = [
    upload.array('images', 10), // Tối đa 10 ảnh
    (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { productId, mauId } = req.body;
            const files = req.files;
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
                    const success = yield HinhAnhSPService_1.HinhAnhSPService.create({
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
                    }
                    else {
                        results.push({
                            filename: file.filename,
                            status: 'failed',
                            error: 'Không thể lưu vào database'
                        });
                    }
                }
                catch (error) {
                    results.push({
                        filename: file.filename,
                        status: 'failed',
                        error: error.message
                    });
                }
            }
            return res.status(200).json({
                success: true,
                message: `Upload hoàn tất. Thành công: ${results.filter(r => r.status === 'success').length}/${files.length}`,
                data: results
            });
        }
        catch (error) {
            console.error('Lỗi khi upload ảnh:', error);
            return res.status(500).json({
                success: false,
                message: 'Lỗi server: ' + error.message
            });
        }
    })
];
