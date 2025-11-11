import { authService } from "./index.js";
import status from "http-status";

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Name is required"
            });
        }

        if (!email || !email.trim()) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Email is required"
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        if (!password || password.length < 6) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Create user
        const user = await authService.createUser(name, email, password);

        // Generate token
        const token = authService.generateToken(user._id.toString());

        return res.status(status.CREATED).json({
            success: true,
            message: "Account created successfully",
            data: {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email
                },
                token
            }
        });
    } catch (error) {
        if (error.message === "An account with this email already exists") {
            return res.status(status.CONFLICT).json({
                success: false,
                message: error.message
            });
        }
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error creating account",
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !email.trim()) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Email is required"
            });
        }

        if (!password) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Password is required"
            });
        }

        // Login user
        const user = await authService.loginUser(email, password);

        // Generate token
        const token = authService.generateToken(user._id.toString());

        return res.json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email
                },
                token
            }
        });
    } catch (error) {
        if (error.message === "Invalid email or password") {
            return res.status(status.UNAUTHORIZED).json({
                success: false,
                message: error.message
            });
        }
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error during login",
            error: error.message
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await authService.getUserById(userId);
        
        if (!user) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            message: "User fetched successfully",
            data: {
                id: user._id.toString(),
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching user",
            error: error.message
        });
    }
};

