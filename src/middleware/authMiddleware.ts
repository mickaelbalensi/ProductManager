import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

// Interface pour étendre Request avec l'utilisateur
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    familyName: string;
  };
}

// Middleware d'authentification JWT
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Access token is required'
      });
    }

    // Vérifier le format "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Invalid token format. Use: Bearer <token>'
      });
    }

    const token: string = parts[1] as string;

    // Vérifier et décoder le token
    const decoded = AuthService.verifyToken(token);
    
    // Récupérer l'utilisateur depuis la base de données
    const user = await AuthService.getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: 'User not found'
      });
    }

    // Attacher l'utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      familyName: user.familyName,
    };

    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    
    // Gestion des erreurs spécifiques
    if (error.message === 'INVALID_TOKEN') {
      return res.status(401).json({
        error: 'Invalid or expired token'
      });
    }

    // Erreurs JWT (token expiré, malformé, etc.)
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

// // Middleware optionnel pour les routes qui peuvent fonctionner avec ou sans auth
// export const optionalAuthMiddleware = async (
//   req: AuthenticatedRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const authHeader = req.headers.authorization;
    
//     if (!authHeader) {
//       // Pas de token, on continue sans utilisateur
//       return next();
//     }

//     const parts = authHeader.split(' ');
//     if (parts.length !== 2 || parts[0] !== 'Bearer') {
//       // Format invalide, on continue sans utilisateur
//       return next();
//     }

//     const token: string = parts[1] as string;
//     const decoded = AuthService.verifyToken(token);
//     const user = await AuthService.getUserById(decoded.userId);
    
//     if (user) {
//       req.user = {
//         id: user.id,
//         email: user.email,
//         firstName: user.firstName,
//         familyName: user.familyName,
//       };
//     }

//     next();
//   } catch (error) {
//     // En cas d'erreur, on continue sans utilisateur
//     next();
//   }
// };
