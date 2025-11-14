import request from 'supertest';
import { createTestApp, cleanDatabase, testPrisma } from './helpers/testHelper';

describe('Projects Integration Tests', () => {
  const app = createTestApp();

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await testPrisma.$disconnect();
  });

  describe('POST /projects', () => {
    it('should create a project successfully with authentication', async () => {
      // Créer un utilisateur de test
      const userData = {
        firstName: 'John',
        familyName: 'Doe',
        email: `test-${Date.now()}@example.com`,
        password: 'password123'
      };

      const registerResponse = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      const userToken = registerResponse.body.token;

      // Créer un projet
      const projectData = {
        name: 'Test Project',
        description: 'A test project'
      };

      const response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${userToken}`)
        .send(projectData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Project created successfully');
      expect(response.body.project).toHaveProperty('name', projectData.name);
      expect(response.body.project).toHaveProperty('description', projectData.description);
      expect(response.body.project).toHaveProperty('id');
    });
  });
});