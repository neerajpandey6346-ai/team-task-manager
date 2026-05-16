import express from 'express';
import {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
} from '../controllers/taskController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    await getAllTasks(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, adminOnly, async (req, res, next) => {
  try {
    await createTask(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    await getTaskById(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    await updateTask(req, res);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', authenticate, async (req, res, next) => {
  try {
    await updateTaskStatus(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    await deleteTask(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;