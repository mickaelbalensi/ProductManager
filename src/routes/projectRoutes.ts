import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';
import { TaskController } from '../controllers/taskController';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Créer un nouveau projet
 *     description: Crée un nouveau projet (authentification requise)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT au format "Bearer {token}"
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhOGUwODExYy04NDU2LTRlYTMtYmEzMy1jYWQ0MDU0NTRkOWYiLCJpYXQiOjE3NjMwNjMxMTIsImV4cCI6MTc2MzE0OTUxMn0.2WdH2GPFcDfhRSG3aANviDgK3z5-MyFJsZeXdZHhktw"
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           default: "application/json"
 *         description: Type de contenu de la requête
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - ownerId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Frontent Product Manager"
 *               description:
 *                 type: string
 *                 example: "Create a frontend for Product Manager to handle products, divide into tasks"
 *               ownerId:
 *                 type: string
 *                 format: uuid
 *                 example: "020ca4fb-e32d-40f5-b37e-ed068c1e0479"
 *           examples:
 *             product_manager_api:
 *               summary: "Exemple de projet ProductManager API"
 *               value:
 *                 name: "Product Manager API"
 *                 description: "Create a backend server for Product Manager to handle products, divide into tasks"
 *                 ownerId: "902ad53e-b0df-4ee3-9e4c-ef2121830bdd"
 *     responses:
 *       201:
 *         description: Projet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', ProjectController.createProject);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Récupérer un projet par ID
 *     description: Récupère les détails d'un projet spécifique (authentification requise)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du projet
 *         example: "8e5db716-c9d5-40a9-9433-8b51417e24f4"
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT au format "Bearer {token}"
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhOGUwODExYy04NDU2LTRlYTMtYmEzMy1jYWQ0MDU0NTRkOWYiLCJpYXQiOjE3NjMwNjMxMTIsImV4cCI6MTc2MzE0OTUxMn0.2WdH2GPFcDfhRSG3aANviDgK3z5-MyFJsZeXdZHhktw"
 *     responses:
 *       200:
 *         description: Projet récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projet non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', ProjectController.getProjectById);

/**
 * @swagger
 * /projects/{id}/tasks:
 *   post:
 *     summary: Créer une tâche dans un projet
 *     description: Ajoute une nouvelle tâche à un projet existant (authentification requise)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du projet
 *         example: "8e5db716-c9d5-40a9-9433-8b51417e24f4"
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT au format "Bearer {token}"
 *         example: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhOGUwODExYy04NDU2LTRlYTMtYmEzMy1jYWQ0MDU0NTRkOWYiLCJpYXQiOjE3NjMwNjMxMTIsImV4cCI6MTc2MzE0OTUxMn0.2WdH2GPFcDfhRSG3aANviDgK3z5-MyFJsZeXdZHhktw"
 *       - in: header
 *         name: Content-Type
 *         required: true
 *         schema:
 *           type: string
 *           default: "application/json"
 *         description: Type de contenu de la requête
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Task 3"
 *               description:
 *                 type: string
 *                 example: "todo 3"
 *     responses:
 *       201:
 *         description: Tâche créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/tasks', TaskController.createTask);

export default router;
