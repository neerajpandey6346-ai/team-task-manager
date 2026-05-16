import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { Project, User, Task } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllProjects = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;
  const offset = (page - 1) * limit;

  let where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }

  const { count, rows } = await Project.findAndCountAll({
    where,
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }
    ],
    offset,
    limit: parseInt(limit),
    order: [['createdAt', 'DESC']],
    distinct: true
  });

  res.status(200).json(
    new ApiResponse(200, {
      projects: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    })
  );
});

export const createProject = asyncHandler(async (req, res) => {
  const { title, description, dueDate, color } = req.body;

  const project = await Project.create({
    title,
    description,
    dueDate,
    color,
    createdBy: req.user.id
  });

  await project.addMember(req.user.id, { through: { role: 'lead' } });

  const projectWithDetails = await Project.findByPk(project.id, {
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }
    ]
  });

  res.status(201).json(
    new ApiResponse(201, { project: projectWithDetails }, 'Project created successfully')
  );
});

export const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id, {
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } },
      { model: Task, as: 'tasks', include: [{ model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] }] }
    ]
  });

  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  res.status(200).json(
    new ApiResponse(200, { project })
  );
});

export const updateProject = asyncHandler(async (req, res) => {
  const { title, description, status, dueDate, color } = req.body;

  const project = await Project.findByPk(req.params.id);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (project.createdBy !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied');
  }

  if (title) project.title = title;
  if (description !== undefined) project.description = description;
  if (status) project.status = status;
  if (dueDate) project.dueDate = dueDate;
  if (color) project.color = color;

  await project.save();

  const updatedProject = await Project.findByPk(project.id, {
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }
    ]
  });

  res.status(200).json(
    new ApiResponse(200, { project: updatedProject }, 'Project updated successfully')
  );
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByPk(req.params.id);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  if (project.createdBy !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied');
  }

  await project.destroy();

  res.status(200).json(
    new ApiResponse(200, {}, 'Project deleted successfully')
  );
});

export const addMember = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { id: projectId } = req.params;

  const project = await Project.findByPk(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMember = await project.hasMember(userId);
  if (isMember) {
    throw new ApiError(400, 'User is already a member of this project');
  }

  await project.addMember(userId, { through: { role: 'member' } });

  const updatedProject = await Project.findByPk(projectId, {
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }
    ]
  });

  res.status(201).json(
    new ApiResponse(201, { project: updatedProject }, 'Member added successfully')
  );
});

export const removeMember = asyncHandler(async (req, res) => {
  const userId = req.body.userId || req.params.userId;
  const { id: projectId } = req.params;

  const project = await Project.findByPk(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const isMember = await project.hasMember(userId);
  if (!isMember) {
    throw new ApiError(400, 'User is not a member of this project');
  }

  await project.removeMember(userId);

  const updatedProject = await Project.findByPk(projectId, {
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'members', attributes: ['id', 'name', 'email'], through: { attributes: [] } }
    ]
  });

  res.status(200).json(
    new ApiResponse(200, { project: updatedProject }, 'Member removed successfully')
  );
});