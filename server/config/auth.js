import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const setCookieToken = (res, token) => {
  const expiresIn = parseInt(process.env.COOKIE_EXPIRE || '7');
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'strict',
    maxAge: expiresIn * 24 * 60 * 60 * 1000,
    path: '/'
  });
};

export const clearCookie = (res) => {
  res.clearCookie('token', { path: '/' });
};