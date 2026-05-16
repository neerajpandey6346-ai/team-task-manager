import express from 'express';
import { 
  signup, 
  login, 
  logout, 
  getCurrentUser,
  updateProfile,
  changePassword
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { signupValidation, loginValidation } from '../middleware/validation.js';

const router = express.Router();

router.post('/signup', signupValidation, async (req, res, next) => {
  try { await signup(req, res); } catch (error) { next(error); }
});

router.post('/login', loginValidation, async (req, res, next) => {
  try { await login(req, res); } catch (error) { next(error); }
});

router.post('/logout', async (req, res, next) => {
  try { await logout(req, res); } catch (error) { next(error); }
});

router.get('/me', authenticate, async (req, res, next) => {
  try { await getCurrentUser(req, res); } catch (error) { next(error); }
});

router.put('/profile', authenticate, async (req, res, next) => {
  try { await updateProfile(req, res); } catch (error) { next(error); }
});

router.put('/change-password', authenticate, async (req, res, next) => {
  try { await changePassword(req, res); } catch (error) { next(error); }
});

export default router;