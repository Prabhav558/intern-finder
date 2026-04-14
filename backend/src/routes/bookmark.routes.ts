import { Router } from 'express';
import { bookmarkController } from '../controllers/bookmark.controller.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route GET /api/bookmarks
 * @desc Get all bookmarks for authenticated user
 * @auth Required
 * @query { limit?, offset?, sortBy? }
 */
router.get('/', authMiddleware, bookmarkController.getBookmarks);

/**
 * @route POST /api/bookmarks/:opportunityId
 * @desc Save opportunity to bookmarks
 * @auth Required
 * @param opportunityId - Opportunity ID
 */
router.post(
  '/:opportunityId',
  authMiddleware,
  bookmarkController.saveBookmark
);

/**
 * @route DELETE /api/bookmarks/:opportunityId
 * @desc Remove opportunity from bookmarks
 * @auth Required
 * @param opportunityId - Opportunity ID
 */
router.delete(
  '/:opportunityId',
  authMiddleware,
  bookmarkController.removeBookmark
);

/**
 * @route GET /api/bookmarks/check/:opportunityId
 * @desc Check if opportunity is bookmarked
 * @auth Required
 * @param opportunityId - Opportunity ID
 */
router.get(
  '/check/:opportunityId',
  authMiddleware,
  bookmarkController.checkBookmark
);

/**
 * @route GET /api/bookmarks/trending
 * @desc Get trending bookmarked opportunities
 * @query { limit? }
 */
router.get(
  '/trending',
  optionalAuthMiddleware,
  bookmarkController.getTrendingBookmarked
);

export default router;
