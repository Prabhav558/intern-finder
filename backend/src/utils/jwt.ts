import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'STUDENT' | 'ADMIN' | 'COMPANY';
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

export const jwtUtils = {
  // Generate access token (15 minutes)
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE_IN,
      algorithm: 'HS256',
    });
  },

  // Generate refresh token (7 days)
  generateRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.REFRESH_TOKEN_EXPIRE_IN,
      algorithm: 'HS256',
    });
  },

  // Verify access token
  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  },

  // Verify refresh token
  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      return jwt.verify(token, config.JWT_SECRET) as RefreshTokenPayload;
    } catch (error) {
      return null;
    }
  },

  // Decode token without verification
  decodeToken(token: string) {
    return jwt.decode(token);
  },

  // Extract token from Authorization header
  extractToken(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
    return null;
  },
};

export default jwtUtils;
