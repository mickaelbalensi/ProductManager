import { PrismaClient, Comment } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateCommentData {
  content: string;
  taskId: string;
  authorId: string;
}

export class CommentService {
  static async createComment(data: CreateCommentData): Promise<Comment> {
    const task = await prisma.task.findUnique({
      where: { id: data.taskId },
    });

    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }

    const author = await prisma.user.findUnique({
      where: { id: data.authorId },
    });

    if (!author) {
      throw new Error('AUTHOR_NOT_FOUND');
    }

    return await prisma.comment.create({
      data: {
        content: data.content,
        taskId: data.taskId,
        authorId: data.authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            familyName: true,
            email: true
          }
        },
        task: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
  }

  static async getCommentsByTaskId(taskId: string): Promise<Comment[]> {
    return await prisma.comment.findMany({
      where: { taskId },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            familyName: true,
            email: true
          }
        }
      },
      orderBy: {
        id: 'asc' 
      }
    });
  }
}
