import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';
import { TaskController } from '../controllers/taskController';

const router = Router();

router.use(authMiddleware);

router.post('/', ProjectController.createProject);

router.get('/:id', ProjectController.getProjectById);

router.post('/:id/tasks', TaskController.createTask);

export default router;
