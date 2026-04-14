import { Request, Response, NextFunction } from 'express';
import { jwtUtils, TokenPayload } from '../utils/jwt.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      userId?: string;
    }
  }
}

/**
 * Middleware to authenticate JWT token from Authorization header
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = jwtUtils.extractToken(authHeader);

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized - No token provided',
      code: 'NO_TOKEN',
    });
  }

  const payload = jwtUtils.verifyAccessToken(token);
  if (!payload) {
    return res.status(401).json({
      error: 'Unauthorized - Invalid or expired token',
      code: 'INVALID_TOKEN',
    });
  }

  req.user = payload;
  req.userId = payload.userId;
  next();
};

/**
 * Middleware to check if user has specific role
 */
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized - No user',
        code: 'NO_USER',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden - Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: roles,
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = jwtUtils.extractToken(authHeader);

  if (token) {
    const payload = jwtUtils.verifyAccessToken(token);
    if (payload) {
      req.user = payload;
      req.userId = payload.userId;
    }
  }

  next();
};

export default {
  authMiddleware,
  roleMiddleware,
  optionalAuthMiddleware,
};
