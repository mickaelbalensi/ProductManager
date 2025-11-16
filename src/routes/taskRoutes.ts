import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { CommentController } from '../controllers/commentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'une tâche
 *     description: Modifie le statut d'une tâche existante (authentification requise)
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
 *         description: ID de la tâche
 *         example: "605de932-3fd0-447a-a3a8-c5a3bea2ae67"
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *                 example: "done"
 *           examples:
 *             update_to_todo:
 *               summary: "Mettre le statut à 'todo'"
 *               value:
 *                 status: "todo"
 *             update_to_in_progress:
 *               summary: "Mettre le statut à 'in_progress'"
 *               value:
 *                 status: "in_progress"
 *             update_to_done:
 *               summary: "Mettre le statut à 'done'"
 *               value:
 *                 status: "done"
 *     responses:
 *       200:
 *         description: Statut de la tâche mis à jour avec succès
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
 *       404:
 *         description: Tâche non trouvée
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
router.patch('/:id/status', TaskController.updateTaskStatus);

/**
 * @swagger
 * /tasks/{id}/comments:
 *   post:
 *     summary: Ajouter un commentaire à une tâche
 *     description: Crée un nouveau commentaire pour une tâche spécifique (authentification requise)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la tâche
 *         example: "605de932-3fd0-447a-a3a8-c5a3bea2ae67"
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
 *               - content
 *               - authorId
 *             properties:
 *               content:
 *                 type: string
 *                 example: "very nice task"
 *               authorId:
 *                 type: string
 *                 format: uuid
 *                 example: "8fe12b3b-486c-4583-a648-e13f41286740"
 *           examples:
 *             add_comment:
 *               summary: "Ajouter un commentaire de précision"
 *               value:
 *                 content: "precision, add type saety"
 *                 authorId: "8fe12b3b-486c-4583-a648-e13f41286740"
 *     responses:
 *       201:
 *         description: Commentaire créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Tâche non trouvée
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
router.post('/:id/comments', CommentController.createComment);

export default router;
