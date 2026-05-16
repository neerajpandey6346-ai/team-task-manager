import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { Task, Project, User } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllTasks = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, projectId, status, priority, search } = req.query;
  const offset = (page - 1) * limit;

  let where = {};

  if (projectId) {
    const project = await Project.findByPk(projectId);
    if (!project) throw new ApiError(404, 'Project not found');
    where.projectId = projectId;
  }

  if (status) where.status = status;
  if (priority) where.priority = priority;

  if (search) {
    where.title = { [Op.like]: `%${search}%` };
  }

  const { count, rows } = await Task.findAndCountAll({
    where,
    include: [
      { model: Project, as: 'project' },
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
    ],
    offset,
    limit: parseInt(limit),
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json(
    new ApiResponse(200, {
      tasks: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    })
  );
});

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, priority, dueDate } = req.body;

  const project = await Project.findByPk(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found');
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo,
    priority,
    dueDate,
    createdBy: req.user.id,
    status: 'todo'
  });

  const taskWithDetails = await Task.findByPk(task.id, {
    include: [
      { model: Project, as: 'project' },
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
    ]
  });

  res.status(201).json(
    new ApiResponse(201, { task: taskWithDetails }, 'Task created successfully')
  );
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id, {
    include: [
      { model: Project, as: 'project' },
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
    ]
  });

  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  res.status(200).json(
    new ApiResponse(200, { task })
  );
});

export const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, assignedTo } = req.body;

  const task = await Task.findByPk(req.params.id);
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (task.createdBy !== req.user.id && task.assignedTo !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied');
  }

  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (status) task.status = status;
  if (priority) task.priority = priority;
  if (dueDate) task.dueDate = dueDate;
  if (assignedTo) task.assignedTo = assignedTo;

  await task.save();

  const updatedTask = await Task.findByPk(task.id, {
    include: [
      { model: Project, as: 'project' },
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
    ]
  });

  res.status(200).json(
    new ApiResponse(200, { task: updatedTask }, 'Task updated successfully')
  );
});

export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const task = await Task.findByPk(req.params.id);
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  task.status = status;
  await task.save();

  const updatedTask = await Task.findByPk(task.id, {
    include: [
      { model: Project, as: 'project' },
      { model: User, as: 'assignedUser', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
    ]
  });

  res.status(200).json(
    new ApiResponse(200, { task: updatedTask }, 'Task status updated')
  );
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (!task) {
    throw new ApiError(404, 'Task not found');
  }

  if (task.createdBy !== req.user.id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Access denied');
  }

  await task.destroy();

  res.status(200).json(
    new ApiResponse(200, {}, 'Task deleted successfully')
  );
});