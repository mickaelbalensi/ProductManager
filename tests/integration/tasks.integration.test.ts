import request from 'supertest';
import { createTestApp, cleanDatabase, testPrisma, createTestUser, loginTestUser, createTestProject, createTestTask } from './helpers/testHelper';

describe('Tasks Integration Tests', () => {
  const app = createTestApp();
  let userToken: string;
  let userId: string;
  let projectId: string;

  beforeEach(async () => {
    await cleanDatabase();
    
    // Créer un utilisateur de test
    const user = await createTestUser({
      email: 'task-test@example.com',
      password: 'password123'
    });
    
    const loginResponse = await loginTestUser('task-test@example.com', 'password123');
    userToken = loginResponse.token;
    userId = loginResponse.user.id;

    // Créer un projet de test
    const project = await createTestProject(userToken, {
      name: 'Test Project for Tasks',
      description: 'A project to test tasks'
    });
    projectId = project.project.id;
  });

  afterAll(async () => {
    await cleanDatabase();
    await testPrisma.$disconnect();
  });

  describe('PATCH /tasks/:id/status', () => {
    let taskId: string;

    beforeEach(async () => {
      // Créer une tâche de test
      const task = await createTestTask(userToken, projectId, {
        title: 'Task for Status Update',
        description: 'A task to test status updates'
      });
      taskId = task.task.id;
    });

    it('should update task status successfully', async () => {
      const response = await request(app)
        .patch(`/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'in_progress' })
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Status updated successfully');
      expect(response.body).toHaveProperty('task');
      expect(response.body.task).toHaveProperty('id', taskId);
      expect(response.body.task).toHaveProperty('status', 'in_progress');
    });

    it('should update status from todo to done', async () => {
      const response = await request(app)
        .patch(`/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'done' })
        .expect(200);

      expect(response.body.task).toHaveProperty('status', 'done');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .patch(`/tasks/${taskId}/status`)
        .send({ status: 'in_progress' })
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    it('should return 400 for missing status', async () => {
      const response = await request(app)
        .patch(`/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Status is required');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .patch(`/tasks/${taskId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'invalid_status' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid status. Allowed: todo, in_progress, done');
    });

    it('should return 500 for non-existent task', async () => {
      const fakeTaskId = '00000000-0000-0000-0000-000000000000';
      
      const response = await request(app)
        .patch(`/tasks/${fakeTaskId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'in_progress' })
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should validate all allowed statuses', async () => {
      const validStatuses = ['todo', 'in_progress', 'done'];
      
      for (const status of validStatuses) {
        const response = await request(app)
          .patch(`/tasks/${taskId}/status`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({ status })
          .expect(200);

        expect(response.body.task).toHaveProperty('status', status);
      }
    });
  });

  describe('POST /tasks/:id/comments', () => {
    let taskId: string;

    beforeEach(async () => {
      // Créer une tâche de test
      const task = await createTestTask(userToken, projectId, {
        title: 'Task for Comments',
        description: 'A task to test comments'
      });
      taskId = task.task.id;
    });

    it('should create a comment successfully', async () => {
      const commentData = {
        content: 'This is a test comment',
        authorId: userId
      };

      const response = await request(app)
        .post(`/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Comment created successfully');
      expect(response.body).toHaveProperty('comment');
      expect(response.body.comment).toHaveProperty('id');
      expect(response.body.comment).toHaveProperty('content', commentData.content);
      expect(response.body.comment).toHaveProperty('taskId', taskId);
      expect(response.body.comment).toHaveProperty('authorId', userId);
      expect(response.body.comment).toHaveProperty('author');
      expect(response.body.comment.author).toHaveProperty('id', userId);
    });

    it('should return 401 without authentication', async () => {
      const commentData = {
        content: 'Unauthorized comment',
        authorId: userId
      };

      const response = await request(app)
        .post(`/tasks/${taskId}/comments`)
        .send(commentData)
        .expect(401);

      expect(response.body).toHaveProperty('error', 'Access token is required');
    });

    it('should return 400 for missing content', async () => {
      const commentData = {
        authorId: userId
      };

      const response = await request(app)
        .post(`/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Content and authorId are required');
    });

    it('should return 400 for missing authorId', async () => {
      const commentData = {
        content: 'Comment without author'
      };

      const response = await request(app)
        .post(`/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Content and authorId are required');
    });

    it('should return 400 for empty content', async () => {
      const commentData = {
        content: '   ',
        authorId: userId
      };

      const response = await request(app)
        .post(`/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Content must be a non-empty string');
    });

    it('should return 404 for non-existent task', async () => {
      const fakeTaskId = '00000000-0000-0000-0000-000000000000';
      const commentData = {
        content: 'Comment for non-existent task',
        authorId: userId
      };

      const response = await request(app)
        .post(`/tasks/${fakeTaskId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 404 for non-existent author', async () => {
      const fakeAuthorId = '00000000-0000-0000-0000-000000000000';
      const commentData = {
        content: 'Comment with fake author',
        authorId: fakeAuthorId
      };

      const response = await request(app)
        .post(`/tasks/${taskId}/comments`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(commentData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Author user not found');
    });
  });
});
