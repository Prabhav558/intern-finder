import { Router, Request, Response } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @body { email, password, name, role? }
 */
router.post('/register', authController.register);

/**
 * @route POST /api/auth/login
 * @desc Login user and get tokens
 * @body { email, password }
 */
router.post('/login', authController.login);

/**
 * @route GET /api/auth/me
 * @desc Get current authenticated user
 * @auth Required
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token using refresh token
 * @body { refreshToken? }
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 * @auth Required
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset
 * @body { email }
 */
router.post('/forgot-password', authController.forgotPassword);

export default router;
