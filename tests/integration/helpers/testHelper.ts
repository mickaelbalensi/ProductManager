import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

if (!process.env.DATABASE_URL) {
  dotenv.config({ path: './env.test' });
}

import authRoutes from '../../../src/routes/authRoutes';
import projectRoutes from '../../../src/routes/projectRoutes';
import taskRoutes from '../../../src/routes/taskRoutes';

export const testPrisma = new PrismaClient();

export const createTestApp = () => {
  const app = express();
  
  // Middlewares
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  
  // Routes
  app.use('/auth', authRoutes);
  app.use('/projects', projectRoutes);
  app.use('/tasks', taskRoutes);
  
  return app;
};

export const cleanDatabase = async () => {
  await testPrisma.comment.deleteMany();
  await testPrisma.task.deleteMany();
  await testPrisma.project.deleteMany();
  await testPrisma.user.deleteMany();
};

export const createTestUser = async (userData?: Partial<any>) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const defaultUser = {
    firstName: 'Test',
    familyName: 'User',
    email: `test-${timestamp}-${random}@example.com`,
    password: 'password123'
  };
  
  const app = createTestApp();
  const response = await request(app)
    .post('/auth/register')
    .send({ ...defaultUser, ...userData });
    
  return response.body;
};

export const loginTestUser = async (email: string, password: string) => {
  const app = createTestApp();
  const response = await request(app)
    .post('/auth/login')
    .send({ email, password });
    
  return response.body;
};

export const createTestProject = async (token: string, projectData?: Partial<any>) => {
  const defaultProject = {
    name: `Test Project ${Date.now()}`,
    description: 'A test project'
  };
  
  const app = createTestApp();
  const response = await request(app)
    .post('/projects')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...defaultProject, ...projectData });
    
  return response.body;
};

export const createTestTask = async (token: string, projectId: string, taskData?: Partial<any>) => {
  const defaultTask = {
    title: `Test Task ${Date.now()}`,
    description: 'A test task'
  };
  
  const app = createTestApp();
  const response = await request(app)
    .post(`/projects/${projectId}/tasks`)
    .set('Authorization', `Bearer ${token}`)
    .send({ ...defaultTask, ...taskData });
    
  return response.body;
};

export const createTestComment = async (token: string, taskId: string, commentData?: Partial<any>) => {
  const defaultComment = {
    content: `Test comment ${Date.now()}`
  };
  
  const app = createTestApp();
  const response = await request(app)
    .post(`/tasks/${taskId}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send({ ...defaultComment, ...commentData });
    
  return response.body;
};
