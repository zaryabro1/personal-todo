import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "./auth.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};

export const createUser = async (name, email, password) => {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new Error("An account with this email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword
    });

    // Remove password from user object
    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
};

export const loginUser = async (email, password) => {
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    // Remove password from user object
    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
};

export const getUserById = async (userId) => {
    const user = await User.findById(userId).select("-password");
    return user;
};

