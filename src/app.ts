import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import { swaggerUi, specs } from './swagger';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://product-manager-vo2.xyz',
    'http://127.0.0.1:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes API
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello ProductManager API!',
    timestamp: new Date().toISOString(),
    status: 'running',
    endpoints: {
      auth: '/auth (register, login)',
      users: '/users',
      projects: '/projects (protected)',
      tasks: '/tasks (protected)',
      health: '/health',
      documentation: '/api-docs'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', database: 'connected' });
});

app.listen(PORT, () => {
  console.log(`🚀 Le server runne au Port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
});
