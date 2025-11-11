import { authService } from "./index.js";
import status from "http-status";

export const authenticate = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(status.UNAUTHORIZED).json({
                success: false,
                message: "Authentication required. Please provide a valid token."
            });
        }

        const token = authHeader.substring(7); // Remove "Bearer " prefix

        // Verify token
        const decoded = authService.verifyToken(token);
        
        if (!decoded || !decoded.userId) {
            return res.status(status.UNAUTHORIZED).json({
                success: false,
                message: "Invalid or expired token. Please log in again."
            });
        }

        // Attach userId to request
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(status.UNAUTHORIZED).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
};

