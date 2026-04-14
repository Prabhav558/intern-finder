import { Request, Response } from 'express';
import { bookmarkService } from '../services/bookmark.service.js';

export const bookmarkController = {
  /**
   * POST /api/bookmarks/:opportunityId
   */
  async saveBookmark(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { opportunityId } = req.params;

      const bookmark = await bookmarkService.saveOpportunity(
        req.userId,
        opportunityId
      );

      res.status(201).json({
        ...bookmark,
        message: 'Opportunity saved to bookmarks',
      });
    } catch (error: any) {
      console.error('Save bookmark error:', error);
      res.status(400).json({
        error: error.message || 'Failed to save bookmark',
        code: 'SAVE_ERROR',
      });
    }
  },

  /**
   * DELETE /api/bookmarks/:opportunityId
   */
  async removeBookmark(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { opportunityId } = req.params;

      const result = await bookmarkService.removeBookmark(
        req.userId,
        opportunityId
      );

      res.status(200).json(result);
    } catch (error: any) {
      console.error('Remove bookmark error:', error);
      res.status(400).json({
        error: error.message || 'Failed to remove bookmark',
        code: 'REMOVE_ERROR',
      });
    }
  },

  /**
   * GET /api/bookmarks
   */
  async getBookmarks(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { limit = '20', offset = '0', sortBy = 'recent' } = req.query;

      const result = await bookmarkService.getBookmarks(
        req.userId,
        parseInt(limit as string),
        parseInt(offset as string),
        sortBy as string
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
   * GET /api/bookmarks/check/:opportunityId
   */
  async checkBookmark(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { opportunityId } = req.params;

      const isBookmarked = await bookmarkService.isBookmarked(
        req.userId,
        opportunityId
      );

      res.status(200).json({ isBookmarked });
    } catch (error: any) {
      console.error('Check bookmark error:', error);
      res.status(500).json({
        error: error.message || 'Failed to check bookmark',
        code: 'FETCH_ERROR',
      });
    }
  },

  /**
   * GET /api/bookmarks/trending
   */
  async getTrendingBookmarked(req: Request, res: Response) {
    try {
      const { limit = '10' } = req.query;

      const opportunities = await bookmarkService.getTrendingBookmarked(
        parseInt(limit as string)
      );

      res.status(200).json({ opportunities });
    } catch (error: any) {
      console.error('Get trending error:', error);
      res.status(500).json({
        error: error.message || 'Failed to fetch trending',
        code: 'FETCH_ERROR',
      });
    }
  },
};

export default bookmarkController;
