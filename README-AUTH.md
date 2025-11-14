# Authentication Implementation

## 🚀 Installation des dépendances

Avant de tester l'authentification, installez les dépendances nécessaires :

```bash
npm install bcrypt jsonwebtoken @types/bcrypt @types/jsonwebtoken
```

## 🔄 Migration de la base de données

Appliquez la migration pour ajouter le champ `password` au modèle User :

```bash
# Avec Docker
docker compose exec app npx prisma migrate dev --name add_user_password_auth

# Ou en local
npx prisma migrate dev --name add_user_password_auth
```

## 🔧 Configuration

Les variables d'environnement suivantes ont été ajoutées au fichier `.env` :

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

**⚠️ Important :** Changez `JWT_SECRET` en production avec une clé sécurisée !

## 📋 Endpoints d'authentification

### 🔐 Inscription
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "familyName": "Doe", 
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "john.doe@example.com",
    "firstName": "John",
    "familyName": "Doe"
  },
  "token": "jwt-token-here"
}
```

### 🔑 Connexion
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### 👤 Profil utilisateur
```http
GET /auth/me
Authorization: Bearer <token>
```

## 🛡️ Routes protégées

Les routes suivantes nécessitent maintenant un token JWT :

- **Tous les endpoints `/projects`**
- **Tous les endpoints `/tasks`** 
- **Tous les endpoints de commentaires**

### Format d'authentification
```http
Authorization: Bearer <your-jwt-token>
```

## 🧪 Tests

Utilisez le fichier `test-auth.http` pour tester tous les endpoints d'authentification.

## 🔒 Sécurité

- **Mots de passe** : Hachés avec bcrypt (12 rounds)
- **Tokens JWT** : Expiration configurable (24h par défaut)
- **Validation** : Email format, mot de passe minimum 6 caractères
- **Erreurs** : Codes HTTP appropriés (400, 401, 409, 500)

## 🚦 Workflow d'utilisation

1. **S'inscrire** avec `/auth/register`
2. **Se connecter** avec `/auth/login` → récupérer le token
3. **Utiliser le token** dans l'en-tête `Authorization: Bearer <token>`
4. **Accéder aux routes protégées** `/projects`, `/tasks`, etc.

## ⚡ Exemple complet

```bash
# 1. Inscription
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","familyName":"Doe","email":"john@example.com","password":"password123"}'

# 2. Connexion (récupérer le token)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# 3. Utiliser une route protégée
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer <token-from-login>"
```

## 🔧 Architecture

- **AuthService** : Logique métier (hashage, JWT, validation)
- **AuthController** : Gestion des requêtes HTTP
- **authMiddleware** : Vérification des tokens JWT
- **Routes protégées** : Middleware appliqué automatiquement
