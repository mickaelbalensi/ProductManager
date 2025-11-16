import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export interface RegisterData {
  firstName: string;
  familyName: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
  };
  token: string;
}

export class AuthService {
  private static readonly SALT_ROUNDS = 12;

  private static get JWT_SECRET(): string {
    return process.env.JWT_SECRET || 'your-secret-key';
  }

  private static get JWT_EXPIRES_IN(): string {
    return process.env.JWT_EXPIRES_IN || '24h';
  }

  private static generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );
  }

  static verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error('INVALID_TOKEN');
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {

    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        familyName: data.familyName,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
      }
    });

    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }

  static async login(data: LoginData): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token
    };
  }

  static async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        familyName: true,
      }
    });
  }
}
