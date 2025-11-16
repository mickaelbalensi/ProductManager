import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    familyName: string;
  };
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Access token is required'
      });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Invalid token format. Use: Bearer <token>'
      });
    }

    const token: string = parts[1] as string;

    const decoded = AuthService.verifyToken(token);
    
    const user = await AuthService.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: 'User not found'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      familyName: user.familyName,
    };

    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    
    if (error.message === 'INVALID_TOKEN') {
      return res.status(401).json({
        error: 'Invalid or expired token'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid or expired token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired'
      });
    }

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

