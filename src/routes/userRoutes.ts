import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const userRouter = Router();

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     description: Enregistre un nouvel utilisateur dans le système
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - familyName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               familyName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password"
 *           examples:
 *             with_password:
 *               summary: "Nouvel utilisateur avec mot de passe"
 *               value:
 *                 firstName: "John"
 *                 familyName: "Doe"
 *                 email: "john.doe@example.com"
 *                 password: "password"
 *             without_password:
 *               summary: "Utilisateur existant sans mot de passe"
 *               value:
 *                 firstName: "John"
 *                 familyName: "Doe"
 *                 email: "john.doe@example.com"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Utilisateur créé avec succès"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
userRouter.post('/', AuthController.register);

export default userRouter;
