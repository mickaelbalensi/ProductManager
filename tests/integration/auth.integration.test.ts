import request from 'supertest';
import { createTestApp, cleanDatabase, testPrisma } from './helpers/testHelper';

describe('Authentication Integration Tests', () => {
  const app = createTestApp();

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await testPrisma.$disconnect();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'John',
        familyName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User registered successfully');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', userData.email);
      expect(response.body.user).not.toHaveProperty('password');
      // firstName et familyName ne sont pas exposés dans la réponse pour des raisons de sécurité
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          // familyName manquant
          email: 'john@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          familyName: 'Doe',
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid email format');
    });

    it('should return 400 for password too short', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          familyName: 'Doe',
          email: 'john@example.com',
          password: '123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Password must be at least 6 characters long');
    });

    it('should return 409 for duplicate email', async () => {
      const userData = {
        firstName: 'John',
        familyName: 'Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      // Premier utilisateur
      await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      // Deuxième utilisateur avec le même email
      const response = await request(app)
        .post('/auth/register')
        .send({
          ...userData,
          firstName: 'Jane'
        })
        .expect(409);

      expect(response.body).toHaveProperty('error', 'User with this email already exists');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Créer un utilisateur pour les tests de login
      await request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          familyName: 'Doe',
          email: 'john@example.com',
          password: 'password123'
        });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('email', 'john@example.com');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Email and password are required');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid email format');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });
  });
});
