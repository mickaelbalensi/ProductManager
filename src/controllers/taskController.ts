import { Request, Response } from 'express';
import { TaskService, CreateTaskData } from '../services/taskService';

export class TaskController {
  
  static async createTask(req: Request, res: Response) {
    try {
      const { title, description }: CreateTaskData = req.body;
      const projectId = req.params.id;

      if (!title) {
        return res.status(400).json({
          error: 'Title is required'
        });
      }

      const task = await TaskService.createTask({ title, description, projectId: projectId as string });
      
      res.status(201).json({
        message: 'Task created successfully',
        task
      });
    } catch (error:any) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          error: 'A task with same title already exists'
        });
      }

      console.error('Error creating user:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }

  static async updateTaskStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
  
      const task = await TaskService.updateTaskStatus(id as string, status);
      res.status(200).json({ message: 'Status updated successfully', task });
      
    } catch (error: any) {
      if (error.message === 'INVALID_STATUS') {
        return res.status(400).json({ 
          error: 'Invalid status. Allowed: todo, in_progress, done' 
        });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
