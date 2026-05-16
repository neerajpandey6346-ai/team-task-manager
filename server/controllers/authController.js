import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { User } from '../models/index.js';
import { generateToken, hashPassword, comparePassword, setCookieToken, clearCookie } from '../config/auth.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'member'
  });

  const token = generateToken(user.id, user.role);
  setCookieToken(res, token);

  const userWithoutPassword = user.toJSON();
  delete userWithoutPassword.password;

  res.status(201).json(
    new ApiResponse(201, { user: userWithoutPassword, token }, 'User registered successfully')
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status && user.status !== 'active') {
    throw new ApiError(403, 'User account is inactive');
  }

  const token = generateToken(user.id, user.role);
  setCookieToken(res, token);

  const userWithoutPassword = user.toJSON();
  delete userWithoutPassword.password;

  res.status(200).json(
    new ApiResponse(200, { user: userWithoutPassword, token }, 'Login successful')
  );
});

export const logout = asyncHandler(async (req, res) => {
  try {
    // Clear cookie on frontend by sending empty token
    res.clearCookie('token', { 
      httpOnly: true, 
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'strict',
      path: '/'
    });
    
    res.status(200).json(
      new ApiResponse(200, {}, 'Logout successful')
    );
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json(
      new ApiResponse(500, {}, 'Logout failed')
    );
  }
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  res.status(200).json(
    new ApiResponse(200, { user }, 'User data retrieved successfully')
  );
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  await user.save();

  const updated = user.toJSON();
  delete updated.password;

  res.status(200).json(new ApiResponse(200, { user: updated }, 'Profile updated successfully'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) throw new ApiError(401, 'Current password is incorrect');

  user.password = await hashPassword(newPassword);
  await user.save();

  res.status(200).json(new ApiResponse(200, {}, 'Password changed successfully'));
});