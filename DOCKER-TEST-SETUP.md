# Configuration Base de Données de Test avec Docker

## 🐳 Configuration Docker

Votre `docker-compose.yml` contient maintenant **2 bases de données** :

### 📊 Base de développement
- **Service** : `db`
- **Port** : `5432`
- **Base** : `productmanager`
- **Container** : `productmanager_db`

### 🧪 Base de test
- **Service** : `db_test`
- **Port** : `5433`
- **Base** : `productmanager_test`
- **Container** : `productmanager_db_test`

## 🚀 Démarrage

```bash
# Démarrer les deux bases de données
docker compose up -d db db_test

# Ou démarrer tout
docker compose up -d
```

## 🔧 Configuration initiale des tests

```bash
# 1. Appliquer les migrations à la base de test
npm run db:migrate:test

# 2. Lancer les tests
npm run test:integration
```

## 📋 Commandes utiles

```bash
# Tests
npm run test:integration    # Tests d'intégration
npm run test:unit          # Tests unitaires
npm run test:all           # Tous les tests

# Base de test
npm run db:migrate:test    # Appliquer migrations
npm run db:reset:test      # Reset complet
npm run db:studio:test     # Prisma Studio (port 5433)

# Base de développement (port 5432)
npm run db:migrate         # Migrations dev
npm run db:studio          # Prisma Studio dev
```

## 🔍 Vérification

Pour vérifier que tout fonctionne :

```bash
# 1. Vérifier que les containers sont démarrés
docker compose ps

# 2. Tester la connexion à la base de test
docker compose exec db_test psql -U postgres -d productmanager_test -c "SELECT 1;"

# 3. Appliquer les migrations de test
npm run db:migrate:test

# 4. Lancer un test simple
npm run test:integration -- --testNamePattern="should register"
```

## 📊 Ports utilisés

- **5432** : Base de développement (`productmanager`)
- **5433** : Base de test (`productmanager_test`)
- **3000** : Application (développement)
- **3001** : Application (tests)

## 🎯 Avantages

- ✅ **Isolation complète** : 2 bases séparées
- ✅ **Pas de scripts** : Tout dans Docker Compose
- ✅ **Persistance** : Volumes Docker dédiés
- ✅ **Simplicité** : `docker compose up -d`

## 🚨 Important

- Les tests utilisent automatiquement le **port 5433**
- La base de test est **automatiquement nettoyée** entre les tests
- **Toujours** démarrer `db_test` avant les tests
