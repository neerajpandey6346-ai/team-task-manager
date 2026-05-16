import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { User } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const offset = (page - 1) * limit;

  let where = { status: 'active' };
  
  if (search) {
    where = {
      ...where,
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ]
    };
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    offset,
    limit: parseInt(limit),
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json(
    new ApiResponse(200, {
      users: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    })
  );
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(
    new ApiResponse(200, { user })
  );
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, bio, avatar } = req.body;
  const userId = req.params.id;

  if (req.user.id !== userId && req.user.role !== 'admin') {
    throw new ApiError(403, 'You can only update your own profile');
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  const userWithoutPassword = user.toJSON();
  delete userWithoutPassword.password;

  res.status(200).json(
    new ApiResponse(200, { user: userWithoutPassword }, 'Profile updated successfully')
  );
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.status = 'inactive';
  await user.save();

  res.status(200).json(
    new ApiResponse(200, {}, 'User deleted successfully')
  );
});