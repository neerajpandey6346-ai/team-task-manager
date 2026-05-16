import express from 'express';
import {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} from '../controllers/projectController.js';
import { authenticate, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, async (req, res, next) => {
  try {
    await getAllProjects(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, adminOnly, async (req, res, next) => {
  try {
    await createProject(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    await getProjectById(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    await updateProject(req, res);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, adminOnly, async (req, res, next) => {
  try {
    await deleteProject(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/members', authenticate, adminOnly, async (req, res, next) => {
  try {
    await addMember(req, res);
  } catch (error) {
    next(error);
  }
});

// Remove member - accepts userId either from URL param or request body
router.delete('/:id/members/:userId', authenticate, adminOnly, async (req, res, next) => {
  try {
    await removeMember(req, res);
  } catch (error) {
    next(error);
  }
});

// Remove member using body (userId in body)  
router.delete('/:id/members', authenticate, adminOnly, async (req, res, next) => {
  try {
    // Move body userId to params for controller compatibility
    req.params.userId = req.body.userId;
    await removeMember(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;