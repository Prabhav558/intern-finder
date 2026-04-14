import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';

export const authController = {
  /**
   * POST /api/auth/register
   */
  async register(req: Request, res: Response) {
    try {
      const { email, password, name, role } = req.body;

      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({
          error: 'Missing required fields: email, password, name',
          code: 'MISSING_FIELDS',
        });
      }

      const result = await authService.register({
        email,
        password,
        name,
        role,
      });

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Register error:', error);
      res.status(400).json({
        error: error.message || 'Registration failed',
        code: 'REGISTER_ERROR',
      });
    }
  },

  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Missing required fields: email, password',
          code: 'MISSING_FIELDS',
        });
      }

      const result = await authService.login({ email, password });

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Login error:', error);
      res.status(401).json({
        error: error.message || 'Login failed',
        code: 'LOGIN_ERROR',
      });
    }
  },

  /**
   * GET /api/auth/me
   */
  async getCurrentUser(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: 'Unauthorized',
          code: 'NO_USER',
        });
      }

      const user = await authService.getCurrentUser(req.userId);
      res.status(200).json(user);
    } catch (error: any) {
      console.error('Get user error:', error);
      res.status(404).json({
        error: error.message || 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }
  },

  /**
   * POST /api/auth/refresh
   */
  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken =
        req.body.refreshToken || req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          error: 'No refresh token provided',
          code: 'NO_REFRESH_TOKEN',
        });
      }

      const result = await authService.refreshToken(refreshToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        error: error.message || 'Token refresh failed',
        code: 'REFRESH_ERROR',
      });
    }
  },

  /**
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          error: 'Unauthorized',
          code: 'NO_USER',
        });
      }

      await authService.logout(req.userId);

      res.clearCookie('refreshToken');
      res.status(200).json({
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: error.message || 'Logout failed',
        code: 'LOGOUT_ERROR',
      });
    }
  },

  /**
   * POST /api/auth/forgot-password (stub)
   */
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: 'Email is required',
          code: 'MISSING_EMAIL',
        });
      }

      // TODO: Implement password reset email logic
      res.status(200).json({
        message: 'Password reset email sent (coming soon)',
      });
    } catch (error: any) {
      res.status(500).json({
        error: error.message || 'Forgot password failed',
        code: 'FORGOT_PASSWORD_ERROR',
      });
    }
  },
};

export default authController;
