import { Router } from 'express';
import { studentController } from '../controllers/student.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All student routes require authentication
router.use(authMiddleware);

/**
 * @route GET /api/students/profile
 * @desc Get authenticated student's profile
 * @auth Required
 */
router.get('/profile', studentController.getProfile);

/**
 * @route PUT /api/students/profile
 * @desc Update authenticated student's profile
 * @auth Required
 * @body { rollNo, branch, graduationYear, cgpa, skills, interests, ... }
 */
router.put('/profile', studentController.updateProfile);

/**
 * @route GET /api/students/public/:userId
 * @desc Get public student profile
 * @param userId - User ID of student
 */
router.get('/public/:userId', studentController.getPublicProfile);

/**
 * @route GET /api/students/applications
 * @desc Get all applications for authenticated student
 * @auth Required
 * @query { status?, limit=10, offset=0 }
 */
router.get('/applications', studentController.getApplications);

/**
 * @route GET /api/students/bookmarks
 * @desc Get all saved opportunities
 * @auth Required
 * @query { limit=10, offset=0 }
 */
router.get('/bookmarks', studentController.getBookmarks);

/**
 * @route GET /api/students/badges
 * @desc Get all badges earned by student
 * @auth Required
 */
router.get('/badges', studentController.getBadges);

/**
 * @route POST /api/students/resume/upload
 * @desc Upload/update student resume
 * @auth Required
 * @body { resumeUrl }
 */
router.post('/resume/upload', studentController.uploadResume);

/**
 * @route GET /api/students/statistics
 * @desc Get student statistics (applications, bookmarks, badges)
 * @auth Required
 */
router.get('/statistics', studentController.getStatistics);

export default router;
