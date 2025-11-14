import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

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
      auth: '/auth (register, login, me)',
      users: '/users',
      projects: '/projects (protected)',
      tasks: '/tasks (protected)',
      health: '/health'
    }
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'OK', database: 'connected' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Le server runne au Port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
});
