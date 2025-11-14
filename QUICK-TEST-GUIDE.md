# Guide Rapide - Base de Données de Test Docker

## 🎯 Base de données séparée

Votre configuration utilise maintenant **2 containers Docker** séparés :

- **Développement** : `productmanager` (port 5432)
- **Tests** : `productmanager_test` (port 5433)

## 🚀 Configuration initiale (une seule fois)

```bash
# 1. Démarrer les bases de données
docker compose up -d db db_test

# 2. Appliquer les migrations à la base de test
npm run db:migrate:test
```

## 🧪 Lancer les tests

```bash
# Tests d'intégration uniquement
npm run test:integration

# Tous les tests (unitaires + intégration)
npm run test:all

# Tests avec coverage
npm run test:coverage
```

## 🛠️ Gestion de la base de test

```bash
# Voir la base de test dans Prisma Studio
npm run db:studio:test

# Remettre à zéro la base de test
npm run db:reset:test

# Redémarrer le container de test
docker compose restart db_test
```

## 🔍 Vérification

Pour vérifier que tout fonctionne :

```bash
# 1. Démarrer les containers
docker compose up -d db db_test

# 2. Appliquer les migrations
npm run db:migrate:test

# 3. Lancer un test simple
npm run test:integration -- --testNamePattern="should register a new user"
```

## 📊 Avantages

- ✅ **Isolation complète** : Aucun impact sur votre base de développement
- ✅ **Tests rapides** : Base dédiée optimisée pour les tests
- ✅ **Nettoyage automatique** : Chaque test repart sur une base propre
- ✅ **Sécurité** : Impossible d'affecter les données de développement

## 🚨 Important

- La base de test est **automatiquement nettoyée** entre chaque test
- **Ne jamais** utiliser cette base pour le développement
- Les tests ne fonctionnent qu'avec `NODE_ENV=test`

## 🐛 En cas de problème

```bash
# Si les tests échouent, essayez :
docker compose restart db_test
npm run db:reset:test
npm run test:integration
```
