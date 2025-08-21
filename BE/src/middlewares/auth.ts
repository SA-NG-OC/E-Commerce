// middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: JwtPayload & { role?: string };
}

// Truyền roles vào để check
export function authMiddleware(allowedRoles: string[] = []) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Chưa đăng nhập" });
            }

            const secret = process.env.JWT_SECRET || "default_secret";
            const decoded = jwt.verify(token, secret) as JwtPayload & { role?: string };
            // THÊM LOG ĐỂ DEBUG
            console.log("Decoded token:", decoded);
            console.log("User role:", decoded.role);
            console.log("Allowed roles:", allowedRoles);

            // Nếu có danh sách role được yêu cầu thì check
            if (allowedRoles.length > 0 && (!decoded.role || !allowedRoles.includes(decoded.role))) {
                return res.status(403).json({ message: "Không có quyền truy cập" });
            }

            req.user = decoded; // gắn user vào request
            next();
        } catch (err) {
            return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
        }
    };
}
