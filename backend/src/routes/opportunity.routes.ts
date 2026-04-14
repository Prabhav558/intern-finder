import { Router } from 'express';
import { opportunityController } from '../controllers/opportunity.controller.js';
import { authMiddleware, optionalAuthMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route GET /api/opportunities
 * @desc List all opportunities with filters
 * @query { type?, domain?, location?, mode?, search?, sort?, limit?, offset? }
 */
router.get('/', optionalAuthMiddleware, opportunityController.listOpportunities);

/**
 * @route GET /api/opportunities/search
 * @desc Full-text search opportunities
 * @query { q, limit?, offset? }
 */
router.get('/search', opportunityController.searchOpportunities);

/**
 * @route GET /api/opportunities/trending
 * @desc Get trending opportunities
 * @query { limit? }
 */
router.get('/trending', opportunityController.getTrendingOpportunities);

/**
 * @route GET /api/opportunities/:id
 * @desc Get specific opportunity details
 * @param id - Opportunity ID
 */
router.get('/:id', optionalAuthMiddleware, opportunityController.getOpportunity);

/**
 * @route POST /api/opportunities
 * @desc Create new opportunity (admin only)
 * @auth Required (ADMIN)
 * @body { title, description, companyName, type, domains, deadline, ... }
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  opportunityController.createOpportunity
);

/**
 * @route PUT /api/opportunities/:id
 * @desc Update opportunity (admin only)
 * @auth Required (ADMIN)
 * @param id - Opportunity ID
 */
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  opportunityController.updateOpportunity
);

/**
 * @route DELETE /api/opportunities/:id
 * @desc Delete opportunity (soft delete, admin only)
 * @auth Required (ADMIN)
 * @param id - Opportunity ID
 */
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  opportunityController.deleteOpportunity
);

/**
 * @route GET /api/opportunities/:id/applications
 * @desc Get applications for opportunity (admin only)
 * @auth Required (ADMIN)
 * @param id - Opportunity ID
 * @query { limit?, offset? }
 */
router.get(
  '/:id/applications',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  opportunityController.getApplications
);

export default router;
