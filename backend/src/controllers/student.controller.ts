import { Request, Response } from 'express';
import { studentService } from '../services/student.service.js';

export const studentController = {
  /**
   * GET /api/students/profile
   */
  async getProfile(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await studentService.getProfile(req.userId);
      res.status(200).json(profile);
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(404).json({
        error: error.message || 'Profile not found',
        code: 'PROFILE_NOT_FOUND',
      });
    }
  },

  /**
   * PUT /api/students/profile
   */
  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const profile = await studentService.updateProfile(
        req.userId,
        req.body
      );
      res.status(200).json(profile);
    } catch (error: any) {
      console.error('Update profile error:', error);
      res.status(400).json({
        error: error.message || 'Failed to update profile',
        code: 'UPDATE_ERROR',
      });
    }
  },

  /**
   * GET /api/students/public/:userId
   */
  async getPublicProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          error: 'User ID is required',
          code: 'MISSING_USER_ID',
        });
      }

      const profile = await studentService.getPublicProfile(userId);
      res.status(200).json(profile);
    } catch (error: any) {
      console.error('Get public profile error:', error);
      res.status(404).json({
        error: error.message || 'Profile not found',
        code: 'PROFILE_NOT_FOUND',
      });
    }
  },

  /**
   * GET /api/students/applications
   */
  async getApplications(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { status, limit = '10', offset = '0' } = req.query;

      const result = await studentService.getApplications(
        req.userId,
        status as string | undefined,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Get applications error:', error);
      res.status(500).json({
        error: error.message || 'Failed to fetch applications',
        code: 'FETCH_ERROR',
      });
    }
  },

  /**
   * GET /api/students/bookmarks
   */
  async getBookmarks(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { limit = '10', offset = '0' } = req.query;

      const result = await studentService.getBookmarks(
        req.userId,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Get bookmarks error:', error);
      res.status(500).json({
        error: error.message || 'Failed to fetch bookmarks',
        code: 'FETCH_ERROR',
      });
    }
  },

  /**
   * GET /api/students/badges
   */
  async getBadges(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const badges = await studentService.getBadges(req.userId);
      res.status(200).json({ badges });
    } catch (error: any) {
      console.error('Get badges error:', error);
      res.status(500).json({
        error: error.message || 'Failed to fetch badges',
        code: 'FETCH_ERROR',
      });
    }
  },

  /**
   * POST /api/students/resume/upload
   */
  async uploadResume(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const resumeUrl = req.body.resumeUrl;

      if (!resumeUrl) {
        return res.status(400).json({
          error: 'Resume URL is required',
          code: 'MISSING_RESUME_URL',
        });
      }

      const profile = await studentService.saveResume(
        req.userId,
        resumeUrl
      );

      res.status(201).json({
        resumeUrl: profile.resumeUrl,
        message: 'Resume uploaded successfully',
      });
    } catch (error: any) {
      console.error('Upload resume error:', error);
      res.status(400).json({
        error: error.message || 'Failed to upload resume',
        code: 'UPLOAD_ERROR',
      });
    }
  },

  /**
   * GET /api/students/statistics
   */
  async getStatistics(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const stats = await studentService.getStatistics(req.userId);
      res.status(200).json(stats);
    } catch (error: any) {
      console.error('Get statistics error:', error);
      res.status(500).json({
        error: error.message || 'Failed to fetch statistics',
        code: 'FETCH_ERROR',
      });
    }
  },
};

export default studentController;
