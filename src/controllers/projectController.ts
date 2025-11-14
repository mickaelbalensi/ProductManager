import { Request, Response } from 'express';
import { ProjectService, CreateProjectData } from '../services/projectService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export class ProjectController {
  
  static async createProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, description } = req.body;
      const ownerId = req.user?.id; 

      if (!name) {
        return res.status(400).json({
          error: 'Name is required'
        });
      }

      if (!ownerId) {
        return res.status(401).json({
          error: 'User not authenticated'
        });
      }

      const project = await ProjectService.createProject({ 
        name, 
        description: description || '',
        ownerId 
      });
      
      res.status(201).json({
        message: 'Project created successfully',
        project
      });
    } catch (error: any) {
      console.error('Error creating project:', error);
      
      if (error.message === 'Owner user not found') {
        return res.status(404).json({
          error: 'Owner user not found'
        });
      }

      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'A project with this name already exists for this user'
        });
      }

      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  // GET /projects/:id - Récupérer un projet avec ses tâches et commentaires
  static async getProjectById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      
      // Validation de l'ID UUID
      if (!id || typeof id !== 'string') {
        return res.status(400).json({
          error: 'Invalid project ID'
        });
      }

      // Récupérer le projet
      const project = await ProjectService.getProjectById(id);

      if (!project) {
        return res.status(404).json({
          error: 'Project not found'
        });
      }

      res.status(200).json({
        project
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
