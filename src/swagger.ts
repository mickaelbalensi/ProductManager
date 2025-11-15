import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ProductManager API',
      version: '1.0.0',
      description: 'API pour la gestion de projets et de tâches avec authentification JWT',
      contact: {
        name: 'API Support',
        email: 'support@productmanager.com'
      }
    },
    servers: [
      {
        url: "https://product-manager-vo2.xyz",
        description: 'Serveur de production'
      },
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Entrez votre token JWT (sans "Bearer ")'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'familyName', 'email'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID unique de l\'utilisateur',
              example: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
            },
            firstName: {
              type: 'string',
              description: 'Prénom de l\'utilisateur',
              example: 'John'
            },
            familyName: {
              type: 'string',
              description: 'Nom de famille de l\'utilisateur',
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de l\'utilisateur',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              description: 'Mot de passe (requis pour l\'inscription)',
              example: 'password'
            }
          }
        },
        Project: {
          type: 'object',
          required: ['name', 'description', 'ownerId'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID unique du projet'
            },
            name: {
              type: 'string',
              description: 'Nom du projet'
            },
            description: {
              type: 'string',
              description: 'Description du projet'
            },
            ownerId: {
              type: 'string',
              format: 'uuid',
              description: 'ID du propriétaire du projet'
            }
          }
        },
        Task: {
          type: 'object',
          required: ['title', 'projectId'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID unique de la tâche'
            },
            title: {
              type: 'string',
              description: 'Titre de la tâche'
            },
            description: {
              type: 'string',
              description: 'Description de la tâche'
            },
            status: {
              type: 'string',
              enum: ['todo', 'in_progress', 'done'],
              description: 'Statut de la tâche'
            },
            projectId: {
              type: 'string',
              format: 'uuid',
              description: 'ID du projet associé'
            }
          }
        },
        Comment: {
          type: 'object',
          required: ['content', 'authorId'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'ID unique du commentaire'
            },
            content: {
              type: 'string',
              description: 'Contenu du commentaire'
            },
            taskId: {
              type: 'string',
              format: 'uuid',
              description: 'ID de la tâche associée'
            },
            authorId: {
              type: 'string',
              format: 'uuid',
              description: 'ID de l\'auteur du commentaire'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Message d\'erreur'
            },
            message: {
              type: 'string',
              description: 'Description détaillée de l\'erreur'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'], // Chemin vers les fichiers contenant les annotations
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
