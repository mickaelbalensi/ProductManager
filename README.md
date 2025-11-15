# Product Manager API

API REST pour la gestion de projets, tâches et commentaires avec authentification JWT.

## 🚀 Démarrage rapide avec Docker

```bash
# Cloner le projet
git clone <votre-repo>
cd ProductManager

# Créer les fichiers d'environnement
cp env.example .env
cp env.test.example env.test

# Démarrer l'application
docker compose up -d app db
```

L'API sera accessible sur `http://localhost:3000`

## 🧪 Tests d'intégration

```bash
# Tests en local
npm run test:integration

# Tests dans Docker
docker compose run --rm test
```

## 📚 Endpoints

- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `GET /auth/me` - Profil utilisateur
- `POST /projects` - Créer un projet
- `GET /projects/:id` - Détails d'un projet
- `POST /projects/:id/tasks` - Créer une tâche
- `PATCH /tasks/:id/status` - Modifier le statut d'une tâche
- `POST /tasks/:id/comments` - Ajouter un commentaire

## 🛠️ Technologies

- Node.js + TypeScript + Express
- PostgreSQL + Prisma ORM
- JWT Authentication
- Docker + Docker Compose
- Jest pour les tests
