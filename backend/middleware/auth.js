import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Protect routes - checks cookies first (priority), then Bearer token
export const protect = async (req, res, next) => {
    let token;

    // Priority 1: Check HttpOnly cookie
    if (req.cookies?.token) {
        token = req.cookies.token;
    }
    // Priority 2: Check Authorization header (Bearer token)
    else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (!req.user.isActive) {
            return res.status(401).json({ message: 'User account is deactivated' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Admin middleware
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};