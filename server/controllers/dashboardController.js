import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { Task, Project, User } from '../models/index.js';
import { Op } from 'sequelize';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const allTasks = await Task.findAll();
  const allProjects = await Project.findAll();

  const completedTasks = allTasks.filter(t => t.status === 'completed').length;
  const pendingTasks = allTasks.filter(t => t.status !== 'completed').length;
  const overdueTasks = allTasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed'
  ).length;

  const assignedTasks = await Task.findAll({
    where: { assignedTo: userId }
  });

  const stats = {
    totalProjects: allProjects.length,
    totalTasks: allTasks.length,
    completedTasks,
    pendingTasks,
    overdueTasks,
    assignedToMe: assignedTasks.length,
    completionPercentage: allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0
  };

  res.status(200).json(
    new ApiResponse(200, { stats })
  );
});

export const getTasksGroupedByStatus = asyncHandler(async (req, res) => {
  const tasks = await Task.findAll({
    include: [
      { model: User, as: 'assignedUser', attributes: ['id', 'name'] },
      { model: Project, as: 'project', attributes: ['id', 'title'] }
    ]
  });

  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  res.status(200).json(
    new ApiResponse(200, { tasks: groupedTasks })
  );
});

export const getRecentActivity = asyncHandler(async (req, res) => {
  const activities = await Task.findAll({
    include: [
      { model: User, as: 'assignedUser', attributes: ['id', 'name'] },
      { model: User, as: 'creator', attributes: ['id', 'name'] },
      { model: Project, as: 'project', attributes: ['id', 'title'] }
    ],
    order: [['updatedAt', 'DESC']],
    limit: 10
  });

  res.status(200).json(
    new ApiResponse(200, { activities })
  );
});

export const getChartData = asyncHandler(async (req, res) => {
  const tasks = await Task.findAll();

  const statusData = [
    { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length },
    { name: 'Review', value: tasks.filter(t => t.status === 'review').length },
    { name: 'Completed', value: tasks.filter(t => t.status === 'completed').length }
  ];

  const priorityData = [
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length }
  ];

  res.status(200).json(
    new ApiResponse(200, { statusData, priorityData })
  );
});