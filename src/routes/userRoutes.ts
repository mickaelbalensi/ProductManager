import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const userRouter = Router();

userRouter.post('/', AuthController.register);

export default userRouter;
