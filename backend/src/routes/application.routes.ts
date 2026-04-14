import { Router } from 'express';
import { applicationController } from '../controllers/application.controller.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @route POST /api/applications/:opportunityId/apply
 * @desc Apply for an opportunity (student only)
 * @auth Required (STUDENT)
 * @param opportunityId - Opportunity ID
 * @body { resumeUrl?, coverLetter? }
 */
router.post(
  '/:opportunityId/apply',
  roleMiddleware(['STUDENT']),
  applicationController.applyForOpportunity
);

/**
 * @route GET /api/applications/:id
 * @desc Get application details
 * @param id - Application ID
 */
router.get('/:id', applicationController.getApplication);

/**
 * @route PATCH /api/applications/:id/status
 * @desc Update application status (admin only)
 * @auth Required (ADMIN)
 * @param id - Application ID
 * @body { status, notes? }
 */
router.patch(
  '/:id/status',
  roleMiddleware(['ADMIN']),
  applicationController.updateApplicationStatus
);

/**
 * @route POST /api/applications/:id/withdraw
 * @desc Withdraw application (student only)
 * @param id - Application ID
 */
router.post(
  '/:id/withdraw',
  applicationController.withdrawApplication
);

/**
 * @route GET /api/applications/statistics
 * @desc Get application statistics (admin only)
 * @auth Required (ADMIN)
 */
router.get(
  '/statistics',
  roleMiddleware(['ADMIN']),
  applicationController.getStatistics
);

/**
 * @route GET /api/applications/by-status/:status
 * @desc Get applications by status
 * @param status - Application status (PENDING, SHORTLISTED, SELECTED, REJECTED, etc.)
 */
router.get(
  '/by-status/:status',
  applicationController.getApplicationsByStatus
);

/**
 * @route POST /api/applications/bulk-update
 * @desc Bulk update application statuses (admin only)
 * @auth Required (ADMIN)
 * @body { applicationIds: string[], status: string }
 */
router.post(
  '/bulk-update',
  roleMiddleware(['ADMIN']),
  applicationController.bulkUpdateStatus
);

export default router;
