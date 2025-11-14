import { PrismaClient, Project } from '@prisma/client';

const prisma = new PrismaClient();

// Types pour les données d'entrée
export interface CreateProjectData {
  name: string;
  description: string;
  ownerId: string;
}

// export interface UpdateProjectData {
//   name?: string | undefined;
//   description?: string | undefined;
// }

// Service Project avec opérations CRUD
export class ProjectService {
  // Créer un projet
  static async createProject(data: CreateProjectData): Promise<Project> {
    // Vérifier que l'utilisateur propriétaire existe
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

  // Récupérer un projet par ID avec ses tâches et commentaires
//   static async getProjectById(id: string): Promise<Project> {
//     return await prisma.project.findUnique({
//       where: { id },
//       include: {
//         owner: {
//           select: {
//             id: true,
//             firstName: true,
//             familyName: true,
//             email: true
//           }
//         }
//         // Note: Tasks et Comments seront ajoutés dans les prochaines implémentations
//         // tasks: {
//         //   include: {
//         //     comments: {
//         //       include: {
//         //         author: {
//         //           select: {
//         //             id: true,
//         //             firstName: true,
//         //             familyName: true,
//         //             email: true
//         //           }
//         //         }
//         //       }
//         //     }
//         //   }
//         // }
//       }
//     });
//   }

//   // Récupérer tous les projets d'un utilisateur
//   static async getProjectsByOwnerId(ownerId: number): Promise<Project[]> {
//     return await prisma.project.findMany({
//       where: { ownerId },
//       include: {
//         owner: {
//           select: {
//             id: true,
//             firstName: true,
//             familyName: true,
//             email: true
//           }
//         }
//       },
//       orderBy: {
//         createdAt: 'desc'
//       }
//     });
//   }

//   // Mettre à jour un projet
//   static async updateProject(id: number, data: UpdateProjectData): Promise<Project> {
//     return await prisma.project.update({
//       where: { id },
//       data,
//       include: {
//         owner: {
//           select: {
//             id: true,
//             firstName: true,
//             familyName: true,
//             email: true
//           }
//         }
//       }
//     });
//   }

//   // Supprimer un projet
//   static async deleteProject(id: number): Promise<Project> {
//     return await prisma.project.delete({
//       where: { id },
//       include: {
//         owner: {
//           select: {
//             id: true,
//             firstName: true,
//             familyName: true,
//             email: true
//           }
//         }
//       }
//     });
//   }

//   // Vérifier si un projet existe
//   static async projectExists(id: number): Promise<boolean> {
//     const project = await prisma.project.findUnique({
//       where: { id }
//     });
//     return project !== null;
//   }
}
