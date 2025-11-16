import { PrismaClient, Task, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTaskData {
  title: string;
  description: string;
  status?: TaskStatus;
  projectId: string;
}

export class TaskService {
  static async createTask(data: CreateTaskData): Promise<Task> {
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) throw { status: 404, message: 'Project not found' };

    return await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status || TaskStatus.todo,
        projectId: data.projectId,
      },
    });
  }


  static async updateTaskStatus(taskId: string, status: string) {
    const allowedStatuses = Object.values(TaskStatus);
  
    if (!allowedStatuses.includes(status as TaskStatus)) {
        throw new Error('INVALID_STATUS');
    }
    
    return await prisma.task.update({
      where: { id: taskId },
      data: { status: status as TaskStatus }
    });
  }
}