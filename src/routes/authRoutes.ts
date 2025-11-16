import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     description: Crée un compte utilisateur avec email et mot de passe
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
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
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Authentifie un utilisateur et retourne un token JWT
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "password"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', AuthController.login);

export default router;
