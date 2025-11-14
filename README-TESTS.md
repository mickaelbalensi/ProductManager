# Tests d'Intégration - ProductManager API

## 🎯 Vue d'ensemble

Ce projet inclut une suite complète de tests d'intégration qui testent l'API end-to-end avec une vraie base de données PostgreSQL.

## 📋 Types de tests

### 🔐 Tests d'authentification (`auth.integration.test.ts`)
- Inscription d'utilisateurs
- Connexion avec JWT
- Validation des tokens
- Gestion des erreurs d'authentification

### 📁 Tests de projets (`projects.integration.test.ts`)
- Création de projets avec authentification
- Récupération de projets
- Création de tâches dans les projets
- Validation des permissions

### ✅ Tests de tâches (`tasks.integration.test.ts`)
- Mise à jour des statuts de tâches
- Création et récupération de commentaires
- Validation des statuts (todo, in_progress, done)
- Gestion des erreurs

### 🔄 Tests de workflow (`workflow.integration.test.ts`)
- Workflow complet end-to-end
- Scénarios multi-utilisateurs
- Tests de collaboration

## 🚀 Configuration et exécution

### 1. Configuration de la base de données de test

Créer une base de données PostgreSQL séparée pour les tests :

```sql
-- Dans PostgreSQL
CREATE DATABASE productmanager_test;
```

### 2. Variables d'environnement

Le fichier `env.test` contient la configuration de test :

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/productmanager_test?schema=public
PORT=3001
NODE_ENV=test
JWT_SECRET=test-secret-key-for-integration-tests
JWT_EXPIRES_IN=1h
```

### 3. Migration de la base de test

```bash
# Appliquer les migrations à la base de test
npm run db:migrate:test

# Ou avec Docker
docker compose exec app npm run db:migrate:test
```

### 4. Exécution des tests

```bash
# Tests d'intégration uniquement
npm run test:integration

# Tests unitaires uniquement  
npm run test:unit

# Tous les tests
npm run test:all

# Tests avec coverage
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### 5. Reset de la base de test

```bash
# Remettre à zéro la base de test
npm run db:reset:test
```

## 🏗️ Structure des tests

```
tests/
├── integration/
│   ├── helpers/
│   │   └── testHelper.ts          # Utilitaires pour les tests
│   ├── auth.integration.test.ts   # Tests d'authentification
│   ├── projects.integration.test.ts # Tests de projets
│   ├── tasks.integration.test.ts  # Tests de tâches
│   └── workflow.integration.test.ts # Tests end-to-end
├── setup.ts                       # Configuration globale Jest
└── example.test.ts               # Tests unitaires existants
```

## 🛠️ Helpers de test

Le fichier `testHelper.ts` fournit des utilitaires :

- `createTestApp()` - Application Express pour les tests
- `cleanDatabase()` - Nettoyage de la base entre les tests
- `createTestUser()` - Création d'utilisateur de test
- `loginTestUser()` - Connexion et récupération de token
- `createTestProject()` - Création de projet de test
- `createTestTask()` - Création de tâche de test
- `createTestComment()` - Création de commentaire de test

## 📊 Couverture de test

Les tests couvrent :

### ✅ Endpoints testés
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /projects`
- `GET /projects/:id`
- `POST /projects/:id/tasks`
- `PATCH /tasks/:id/status`
- `POST /tasks/:id/comments`
- `GET /tasks/:id/comments`

### ✅ Scénarios testés
- Authentification réussie et échecs
- Validation des données d'entrée
- Gestion des erreurs HTTP (400, 401, 404, 409, 500)
- Permissions et sécurité
- Workflow complet utilisateur
- Collaboration multi-utilisateurs

### ✅ Règles métier testées
- Contraintes d'unicité (email, nom de projet)
- Statuts de tâches valides
- Relations entre entités
- Validation JWT
- Hashage des mots de passe

## 🔧 Exemple d'utilisation

```typescript
// Exemple de test d'intégration
describe('Project Creation', () => {
  it('should create project with authentication', async () => {
    // 1. Créer un utilisateur
    const user = await createTestUser();
    const { token } = await loginTestUser(user.email, 'password123');
    
    // 2. Créer un projet
    const response = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'A test project'
      })
      .expect(201);
    
    // 3. Vérifications
    expect(response.body.project).toHaveProperty('name', 'Test Project');
  });
});
```

## 🚦 Bonnes pratiques

1. **Isolation** : Chaque test nettoie la base avant/après
2. **Données réalistes** : Utilisation de données proches de la réalité
3. **Tests complets** : Vérification des réponses ET de l'état de la base
4. **Gestion d'erreurs** : Tests des cas d'erreur ET de succès
5. **Performance** : Tests rapides avec base de données dédiée

## 🐛 Debugging

Pour débugger les tests :

```bash
# Logs détaillés
DEBUG=* npm run test:integration

# Test spécifique
npm run test:integration -- --testNamePattern="should create project"

# Mode watch pour développement
npm run test:watch tests/integration
```

## 📈 Métriques

Les tests d'intégration vérifient :
- ✅ 40+ scénarios de test
- ✅ 9 endpoints API
- ✅ 5 codes d'erreur HTTP
- ✅ 3 entités principales (User, Project, Task, Comment)
- ✅ Workflow complet end-to-end
- ✅ Sécurité et authentification JWT
