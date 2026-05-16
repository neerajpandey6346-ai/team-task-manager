import { verifyToken } from '../config/auth.js';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/index.js';

export const authenticate = async (req, res, next) => {
  try {
    // Accept token from cookie OR Authorization Bearer header
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '')?.trim();

    if (!token) {
      throw new ApiError(401, 'No authentication token provided');
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      throw new ApiError(401, 'Invalid or expired token');
    }

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.status && user.status !== 'active') {
      throw new ApiError(403, 'User account is inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Only admins can access this resource'));
  }
  next();
};