import { Request, Response } from 'express';
import { AuthService, RegisterData, LoginData } from '../services/authService';

export class AuthController {
  
  static async register(req: Request, res: Response) {
    try {
      const { firstName, familyName, email, password }: RegisterData = req.body;

      if (!firstName || !familyName || !email || !password) {
        return res.status(400).json({
          error: 'firstName, familyName, email and password are required'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format'
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password must be at least 6 characters long'
        });
      }

      const result = await AuthService.register({
        firstName: firstName.trim(),
        familyName: familyName.trim(),
        email: email.toLowerCase().trim(),
        password
      });
      
      res.status(201).json({
        message: 'User registered successfully',
        ...result
      });
    } catch (error: any) {
      console.error('Error registering user:', error);
      
      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'User with this email already exists'
        });
      }

      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password }: LoginData = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: 'Invalid email format'
        });
      }

      const result = await AuthService.login({
        email: email.toLowerCase().trim(),
        password
      });
      
      res.status(200).json({
        message: 'Login successful',
        ...result
      });
    } catch (error: any) {
      console.error('Error logging in user:', error);
      
      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({
          error: 'Invalid email or password'
        });
      }

      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
