// Mock de Prisma Client pour isoler les tests
const mockPrisma = {
  user: {
    create: jest.fn(),
  },
  $disconnect: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}));

import { UserService, CreateUserData } from '../src/services/userService';

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('devrait créer un utilisateur avec succès', async () => {
      // Arrange
      const userData: CreateUserData = {
        firstName: 'John',
        familyName: 'Doe',
        email: 'john.doe@example.com'
      };

      const expectedUser = {
        id: 1,
        firstName: 'John',
        familyName: 'Doe',
        email: 'john.doe@example.com'
      };

      mockPrisma.user.create.mockResolvedValue(expectedUser);

      // Act
      const result = await UserService.createUser(userData);

      // Assert
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          firstName: userData.firstName,
          familyName: userData.familyName,
          email: userData.email,
        },
      });
      expect(result).toEqual(expectedUser);

      console.log("The test of createUser is successful");
    });

    it('devrait propager les erreurs de Prisma', async () => {
      // Arrange
      const userData: CreateUserData = {
        firstName: 'John',
        familyName: 'Doe',
        email: 'john.doe@example.com'
      };
      const error = new Error('Database error');

      mockPrisma.user.create.mockRejectedValue(error);

      // Act & Assert
      await expect(UserService.createUser(userData)).rejects.toThrow('Database error');
    
    });
  });

  });
