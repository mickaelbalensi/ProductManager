import { PrismaClient, Project } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateProjectData {
  name: string;
  description: string;
  ownerId: string;
}


export class ProjectService {
  static async createProject(data: CreateProjectData): Promise<Project> {
    const owner = await prisma.user.findUnique({
      where: { id: data.ownerId }
    });

    if (!owner) {
      throw new Error('Owner user not found');
    }

    return await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        ownerId: data.ownerId,
      }
    });
  }


  static async getProjectById(id: string): Promise<Project> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            familyName: true,
            email: true
          }
        },
        tasks: {
          include: {
            comments: true,
          },
        },
      },
    });

    if (!project) throw { status: 404, message: 'Project not found' };
    return project;
  }

}
