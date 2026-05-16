import User from './User.js';
import Project from './Project.js';
import Task from './Task.js';
import ProjectMember from './ProjectMember.js';

// User associations
User.hasMany(Project, {
  foreignKey: 'createdBy',
  as: 'createdProjects',
  onDelete: 'CASCADE'
});

User.hasMany(Task, {
  foreignKey: 'createdBy',
  as: 'createdTasks',
  onDelete: 'CASCADE'
});

User.hasMany(Task, {
  foreignKey: 'assignedTo',
  as: 'assignedTasks',
  onDelete: 'SET NULL'
});

// Project associations
Project.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

Project.hasMany(Task, {
  foreignKey: 'projectId',
  as: 'tasks',
  onDelete: 'CASCADE'
});

Project.belongsToMany(User, {
  through: ProjectMember,
  as: 'members',
  foreignKey: 'projectId',
  otherKey: 'userId'
});

// Task associations
Task.belongsTo(Project, {
  foreignKey: 'projectId',
  as: 'project'
});

Task.belongsTo(User, {
  foreignKey: 'assignedTo',
  as: 'assignedUser'
});

Task.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

// ProjectMember associations
ProjectMember.belongsTo(Project, {
  foreignKey: 'projectId'
});

ProjectMember.belongsTo(User, {
  foreignKey: 'userId'
});

export { User, Project, Task, ProjectMember };