import { Request, Response } from 'express';
import { opportunityService } from '../services/opportunity.service.js';

export const opportunityController = {
  /**
   * GET /api/opportunities
   */
  async listOpportunities(req: Request, res: Response) {
    try {
      const {
        type,
        domain,
        location,
        mode,
        search,
        sort,
        limit = '20',
        offset = '0',
      } = req.query;

      const result = await opportunityService.listOpportunities({
        type: type as string | undefined,
        domain: domain as string | undefined,
        location: location as string | undefined,
        mode: mode as string | undefined,
        search: search as string | undefined,
        sort: sort as string | undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      });

      res.status(200).json(result);
    } catch (error: any) {
      console.error('List opportunities error:', error);
      res.status(500).json({
        error: error.message || 'Failed to fetch opportunities',
        code: 'FETCH_ERROR',
      });
    }
  },

  /**
   * GET /api/opportunities/:id
   */
  async getOpportunity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const studentId = req.userId;

      const opportunity = await opportunityService.getOpportunityById(
        id,
        studentId
      );

      res.status(200).json(opportunity);
    } catch (error: any) {
      console.error('Get opportunity error:', error);
      res.status(404).json({
        error: error.message || 'Opportunity not found',
        code: 'NOT_FOUND',
      });
    }
  },

  /**
   * POST /api/opportunities (admin only)
   */
  async createOpportunity(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Only admins can create opportunities',
          code: 'FORBIDDEN',
        });
      }

      const opportunity = await opportunityService.createOpportunity(
        req.body,
        req.userId
      );

      res.status(201).json(opportunity);
    } catch (error: any) {
      console.error('Create opportunity error:', error);
      res.status(400).json({
        error: error.message || 'Failed to create opportunity',
        code: 'CREATE_ERROR',
      });
    }
  },

  /**
   * PUT /api/opportunities/:id (admin only)
   */
  async updateOpportunity(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Only admins can update opportunities',
          code: 'FORBIDDEN',
        });
      }

      const { id } = req.params;
      const opportunity = await opportunityService.updateOpportunity(
        id,
        req.body
      );

      res.status(200).json(opportunity);
    } catch (error: any) {
      console.error('Update opportunity error:', error);
      res.status(400).json({
        error: error.message || 'Failed to update opportunity',
        code: 'UPDATE_ERROR',
      });
    }
  },

  /**
   * DELETE /api/opportunities/:id (admin only)
   */
  async deleteOpportunity(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Only admins can delete opportunities',
          code: 'FORBIDDEN',
        });
      }

      const { id } = req.params;
      await opportunityService.deleteOpportunity(id);

      res.status(200).json({
        message: 'Opportunity deleted successfully',
      });
    } catch (error: any) {
      console.error('Delete opportunity error:', error);
      res.status(400).json({
        error: error.message || 'Failed to delete opportunity',
        code: 'DELETE_ERROR',
      });
    }
  },

  /**
   * GET /api/opportunities/trending
   */
  async getTrendingOpportunities(req: Request, res: Response) {
    try {
      const { limit = '10' } = req.query;

      const opportunities = await opportunityService.getTrendingOpportunities(
        parseInt(limit as string)
      );

      res.status(200).json({ opportunities });
    } catch (error: any) {
      console.error('Get trending error:', error);
      res.status(500).json({
        error: error.message || 'Failed to fetch trending opportunities',
        code: 'FETCH_ERROR',
      });
    }
  },

  /**
   * GET /api/opportunities/:id/applications (admin only)
   */
  async getApplications(req: Request, res: Response) {
    try {
      if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Only admins can view applications',
          code: 'FORBIDDEN',
        });
      }

      const { id } = req.params;
      const { limit = '20', offset = '0' } = req.query;

      const result = await opportunityService.getApplications(
        id,
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
   * GET /api/opportunities/search (full-text search)
   */
  async searchOpportunities(req: Request, res: Response) {
    try {
      const { q, limit = '20', offset = '0' } = req.query;

      if (!q) {
        return res.status(400).json({
          error: 'Search query is required',
          code: 'MISSING_QUERY',
        });
      }

      const opportunities = await opportunityService.searchOpportunities(
        q as string,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      res.status(200).json({ opportunities });
    } catch (error: any) {
      console.error('Search error:', error);
      res.status(500).json({
        error: error.message || 'Search failed',
        code: 'SEARCH_ERROR',
      });
    }
  },
};

export default opportunityController;
