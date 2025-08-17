// middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: string | JwtPayload;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        // Lấy token từ Header Authorization: Bearer <token>
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Chưa đăng nhập" });
        }

        // Xác thực token
        const secret = process.env.JWT_SECRET || "default_secret";
        const decoded = jwt.verify(token, secret);

        // Lưu thông tin user vào request
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
}
