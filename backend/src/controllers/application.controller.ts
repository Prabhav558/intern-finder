import { Request, Response } from 'express';
import { applicationService } from '../services/application.service.js';

export const applicationController = {
  /**
   * POST /api/applications/:opportunityId/apply
   */
  async applyForOpportunity(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (req.user?.role !== 'STUDENT') {
        return res.status(403).json({
          error: 'Only students can apply',
          code: 'FORBIDDEN',
        });
      }

      const { opportunityId } = req.params;
      const { resumeUrl, coverLetter } = req.body;

      const application = await applicationService.applyForOpportunity(
        req.userId,
        {
          opportunityId,
          resumeUrl,
          coverLetter,
        }
      );

      res.status(201).json({
        ...application,
        message: 'Application submitted successfully',
      });
    } catch (error: any) {
      console.error('Apply error:', error);
      res.status(400).json({
        error: error.message || 'Failed to submit application',
        code: 'APPLY_ERROR',
      });
    }
  },

  /**
   * GET /api/applications/:id
   */
  async getApplication(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const application = await applicationService.getApplication(id);

      res.status(200).json(application);
    } catch (error: any) {
      console.error('Get application error:', error);
      res.status(404).json({
        error: error.message || 'Application not found',
        code: 'NOT_FOUND',
      });
    }
  },

  /**
   * PATCH /api/applications/:id/status (admin only)
   */
  async updateApplicationStatus(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Only admins can update applications',
          code: 'FORBIDDEN',
        });
      }

      const { id } = req.params;
      const { status, notes } = req.body;

      if (!status) {
        return res.status(400).json({
          error: 'Status is required',
          code: 'MISSING_STATUS',
        });
      }

      const application = await applicationService.updateApplicationStatus(id, {
        status,
        notes,
      });

      res.status(200).json(application);
    } catch (error: any) {
      console.error('Update status error:', error);
      res.status(400).json({
        error: error.message || 'Failed to update application',
        code: 'UPDATE_ERROR',
      });
    }
  },

  /**
   * POST /api/applications/:id/withdraw
   */
  async withdrawApplication(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id } = req.params;

      const application = await applicationService.withdrawApplication(
        req.userId,
        id
      );

      res.status(200).json({
        ...application,
        message: 'Application withdrawn successfully',
      });
    } catch (error: any) {
      console.error('Withdraw error:', error);
      res.status(400).json({
        error: error.message || 'Failed to withdraw application',
        code: 'WITHDRAW_ERROR',
      });
    }
  },

  /**
   * GET /api/applications/statistics (admin only)
   */
  async getStatistics(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Only admins can view statistics',
          code: 'FORBIDDEN',
        });
      }

      const stats = await applicationService.getApplicationStatistics();

      res.status(200).json(stats);
    } catch (error: any) {
      console.error('Get statistics error:', error);
      res.status(500).json({
        error: error.message || 'Failed to fetch statistics',
        code: 'FETCH_ERROR',
      });
    }
  },

  /**
   * POST /api/applications/bulk-update (admin only)
   */
  async bulkUpdateStatus(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Only admins can bulk update',
          code: 'FORBIDDEN',
        });
      }

      const { applicationIds, status } = req.body;

      if (!applicationIds || !Array.isArray(applicationIds) || !status) {
        return res.status(400).json({
          error: 'applicationIds (array) and status are required',
          code: 'MISSING_FIELDS',
        });
      }

      const result = await applicationService.bulkUpdateApplicationStatus(
        applicationIds,
        status
      );

      res.status(200).json({
        ...result,
        message: `Updated ${result.count} applications`,
      });
    } catch (error: any) {
      console.error('Bulk update error:', error);
      res.status(400).json({
        error: error.message || 'Failed to bulk update',
        code: 'BULK_UPDATE_ERROR',
      });
    }
  },

  /**
   * GET /api/applications/by-status/:status
   */
  async getApplicationsByStatus(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { status } = req.params;

      const applications =
        await applicationService.getApplicationsByStatus(
          req.userId,
          status as any
        );

      res.status(200).json({ applications });
    } catch (error: any) {
      console.error('Get by status error:', error);
      res.status(500).json({
        error: error.message || 'Failed to fetch applications',
        code: 'FETCH_ERROR',
      });
    }
  },
};

export default applicationController;
