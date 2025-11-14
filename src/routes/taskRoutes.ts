import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { CommentController } from '../controllers/commentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.patch('/:id/status', TaskController.updateTaskStatus);

router.post('/:id/comments', CommentController.createComment);
// router.get('/:id/comments', CommentController.getCommentsByTask);


export default router;
