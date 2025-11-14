import request from 'supertest';
import { createTestApp, cleanDatabase, testPrisma } from './helpers/testHelper';

describe('Complete Workflow Integration Tests', () => {
  const app = createTestApp();

  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await cleanDatabase();
    await testPrisma.$disconnect();
  });

  describe('End-to-End Workflow', () => {
    it('should complete full project management workflow', async () => {
      // 1. Inscription d'un utilisateur
      const registerResponse = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Alice',
          familyName: 'Johnson',
          email: 'alice@example.com',
          password: 'password123'
        })
        .expect(201);

      expect(registerResponse.body).toHaveProperty('token');
      const token = registerResponse.body.token;
      const userId = registerResponse.body.user.id;

      // 2. Création d'un projet
      const projectResponse = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'E-commerce Platform',
          description: 'Development of a modern e-commerce platform'
        })
        .expect(201);

      expect(projectResponse.body.project).toHaveProperty('name', 'E-commerce Platform');
      const projectId = projectResponse.body.project.id;

      // 3. Récupération du projet créé
      const getProjectResponse = await request(app)
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(getProjectResponse.body.project).toHaveProperty('id', projectId);
      expect(getProjectResponse.body.project.owner).toHaveProperty('id', userId);

      // 4. Création de plusieurs tâches
      const task1Response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Setup Database Schema',
          description: 'Create database tables and relationships'
        })
        .expect(201);

      const task2Response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Implement User Authentication',
          description: 'Add login and registration functionality'
        })
        .expect(201);

      const task3Response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Create Product Catalog',
          description: 'Build product listing and search features'
        })
        .expect(201);

      const task1Id = task1Response.body.task.id;
      const task2Id = task2Response.body.task.id;
      const task3Id = task3Response.body.task.id;

      // Vérifier que toutes les tâches sont créées avec le statut 'todo'
      expect(task1Response.body.task).toHaveProperty('status', 'todo');
      expect(task2Response.body.task).toHaveProperty('status', 'todo');
      expect(task3Response.body.task).toHaveProperty('status', 'todo');

      // 5. Mise à jour des statuts des tâches
      await request(app)
        .patch(`/tasks/${task1Id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'in_progress' })
        .expect(200);

      await request(app)
        .patch(`/tasks/${task2Id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'done' })
        .expect(200);

      // task3 reste en 'todo'

      // 6. Ajout de commentaires sur les tâches
      const comment1Response = await request(app)
        .post(`/tasks/${task1Id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Started working on the database schema. PostgreSQL chosen as the database.',
          authorId: userId
        })
        .expect(201);

      const comment2Response = await request(app)
        .post(`/tasks/${task2Id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Authentication system completed with JWT tokens.',
          authorId: userId
        })
        .expect(201);

      const comment3Response = await request(app)
        .post(`/tasks/${task1Id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'Database schema is now complete. Moving to testing phase.',
          authorId: userId
        })
        .expect(201);

      expect(comment1Response.body.comment).toHaveProperty('content');
      expect(comment2Response.body.comment).toHaveProperty('taskId', task2Id);
      expect(comment3Response.body.comment).toHaveProperty('taskId', task1Id);

      // 7. Finalisation de la première tâche
      await request(app)
        .patch(`/tasks/${task1Id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'done' })
        .expect(200);

      // 8. Vérification finale du projet avec toutes ses données
      const finalProjectResponse = await request(app)
        .get(`/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(finalProjectResponse.body.project).toHaveProperty('name', 'E-commerce Platform');
      expect(finalProjectResponse.body.project).toHaveProperty('ownerId', userId);
      expect(finalProjectResponse.body.project.owner).toHaveProperty('firstName', 'Alice');
    });

    it('should handle multiple users working on different projects', async () => {
      // Créer deux utilisateurs
      const user1Response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Bob',
          familyName: 'Smith',
          email: 'bob@example.com',
          password: 'password123'
        })
        .expect(201);

      const user2Response = await request(app)
        .post('/auth/register')
        .send({
          firstName: 'Carol',
          familyName: 'Davis',
          email: 'carol@example.com',
          password: 'password123'
        })
        .expect(201);

      const token1 = user1Response.body.token;
      const token2 = user2Response.body.token;
      const userId1 = user1Response.body.user.id;
      const userId2 = user2Response.body.user.id;

      // Chaque utilisateur crée son propre projet
      const project1Response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          name: 'Mobile App Development',
          description: 'iOS and Android mobile application'
        })
        .expect(201);

      const project2Response = await request(app)
        .post('/projects')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          name: 'Web Analytics Dashboard',
          description: 'Real-time analytics and reporting dashboard'
        })
        .expect(201);

      const project1Id = project1Response.body.project.id;
      const project2Id = project2Response.body.project.id;

      // Vérifier que chaque utilisateur ne peut accéder qu'à son propre projet
      await request(app)
        .get(`/projects/${project1Id}`)
        .set('Authorization', `Bearer ${token1}`)
        .expect(200);

      await request(app)
        .get(`/projects/${project2Id}`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(200);

      // Créer des tâches dans chaque projet
      const task1Response = await request(app)
        .post(`/projects/${project1Id}/tasks`)
        .set('Authorization', `Bearer ${token1}`)
        .send({
          title: 'Design UI/UX',
          description: 'Create wireframes and mockups'
        })
        .expect(201);

      const task2Response = await request(app)
        .post(`/projects/${project2Id}/tasks`)
        .set('Authorization', `Bearer ${token2}`)
        .send({
          title: 'Setup Data Pipeline',
          description: 'Configure data ingestion and processing'
        })
        .expect(201);

      // Les utilisateurs peuvent commenter leurs propres tâches
      await request(app)
        .post(`/tasks/${task1Response.body.task.id}/comments`)
        .set('Authorization', `Bearer ${token1}`)
        .send({
          content: 'Starting with user research and competitor analysis',
          authorId: userId1
        })
        .expect(201);

      // Un utilisateur peut aussi commenter les tâches d'autres projets s'il a l'ID
      await request(app)
        .post(`/tasks/${task2Response.body.task.id}/comments`)
        .set('Authorization', `Bearer ${token1}`)
        .send({
          content: 'Great project! Let me know if you need help with the frontend.',
          authorId: userId1
        })
        .expect(201);
    });
  });
});
