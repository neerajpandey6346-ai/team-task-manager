import express from 'express';
import {
  getDashboardStats,
  getTasksGroupedByStatus,
  getRecentActivity,
  getChartData
} from '../controllers/dashboardController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', authenticate, async (req, res, next) => {
  try {
    await getDashboardStats(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/tasks', authenticate, async (req, res, next) => {
  try {
    await getTasksGroupedByStatus(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/activity', authenticate, async (req, res, next) => {
  try {
    await getRecentActivity(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/charts', authenticate, async (req, res, next) => {
  try {
    await getChartData(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;