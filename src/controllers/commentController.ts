import { Request, Response } from 'express';
import { CommentService, CreateCommentData } from '../services/commentService';

// Controller pour gérer les endpoints Comment
export class CommentController {
  
  // POST /tasks/:id/comments - Ajouter un commentaire à une tâche
  static async createComment(req: Request, res: Response) {
    try {
      const { id: taskId } = req.params; // ID de la tâche depuis l'URL
      const { content, authorId }: { content: string; authorId: string } = req.body;

      // Validation simple
      if (!content || !authorId) {
        return res.status(400).json({
          error: 'Content and authorId are required'
        });
      }

      // Validation du contenu
      if (typeof content !== 'string' || content.trim().length === 0) {
        return res.status(400).json({
          error: 'Content must be a non-empty string'
        });
      }

      // Validation de l'authorId
      if (typeof authorId !== 'string' || !authorId.trim()) {
        return res.status(400).json({
          error: 'authorId must be a valid UUID string'
        });
      }

      // Créer le commentaire
      const comment = await CommentService.createComment({ 
        content: content.trim(), 
        taskId: taskId as string,
        authorId 
      });
      
      res.status(201).json({
        message: 'Comment created successfully',
        comment
      });
    } catch (error: any) {
      console.error('Error creating comment:', error);
      
      // Gestion des erreurs spécifiques
      if (error.message === 'TASK_NOT_FOUND') {
        return res.status(404).json({
          error: 'Task not found'
        });
      }

      if (error.message === 'AUTHOR_NOT_FOUND') {
        return res.status(404).json({
          error: 'Author user not found'
        });
      }

      // Erreur de contrainte unique ou autre erreur Prisma
      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'Comment already exists'
        });
      }

      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
