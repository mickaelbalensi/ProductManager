# ProductManager

## Aperçu

**ProductManager** est une API Node.js de gestion de projets permettant de :
- Créer et gérer des utilisateurs (enregistrement, login)
- Créer, lister et supprimer des projets
- Gérer des tâches avec statuts, et ajouter des commentaires aux tâches

---

### Endpoints principaux

- **`POST /auth/register`** — Inscription d'un utilisateur
- **`POST /auth/login`** — Connexion utilisateur (retourne un token JWT)
- **`POST /users`** — Créer un utilisateur
- **`POST /projects`** — Créer un projet (JWT requis)
- **`GET /projects/{id}`** — Récupérer les infos d’un projet (JWT requis)
- **`POST /projects/{id}/tasks`** — Ajouter une tâche à un projet (JWT requis)
- **`PATCH /tasks/{id}/status`** — Changer le statut d’une tâche (JWT requis)
- **`POST /tasks/{id}/comments`** — Ajouter un commentaire à une tâche (JWT requis)

---

### Autres endpoints utiles
- **`GET /health`** — Healthcheck du serveur
- **`GET /api-docs`** — Interface Swagger interactive
- **`GET /`** — Endpoint racine (infos et status API)

Pour la description complète de chaque endpoint et l'expérimentation interactive, voir la section _Documentation API : Swagger_ plus bas.

---

👉 Tous les détails d’inputs, outputs, droits et sécurité sont détaillés dans la section _Documentation API : Swagger_.

---

## Serveur déjà en ligne

L’API est **déjà déployée** sur mon domaine personnel :  
- **API** : https://product-manager-vo2.xyz
- **Documentation Swagger (interactive)** : https://product-manager-vo2.xyz/api-docs  
   _(section [3. Documentation API : Swagger](#3-documentation-api--swagger) ci-après pour l’utilisation complète avec authentification !)_

Vous pouvez explorer l’API, tester tous les endpoints et utiliser la console Swagger pour effectuer toutes les opérations supportées, sans rien installer localement.

- **Consultation de la base de données** :
    Accédez à la base cloud en direct depuis Prisma Studio avec   :
    ```bash
    DATABASE_URL=postgresql://product_manager_db_uw4u_user:XXXXX@dpg-d4cbtls9c44c738nmui0-a.oregon-postgres.render.com/product_manager_db_uw4u npx prisma studio
    ```
    > Cela ouvre une interface de visualisation locale connectée à la base distante (à utiliser dans un cadre test/projet uniquement).

---

## 1. Installation

```bash
git clone https://github.com/mickaelbalensi/ProductManager.git
cd ProductManager
npm install
```
Variables d’environnement :
- `.env` pour le dev local
- `.env.prod` pour utiliser la base cloud avec Prisma Studio

---

## 2. Démarrer l’application

Avec Docker :
```bash
docker compose up --build
```
- API : http://localhost:3000
- DB : postgresql://postgres:password@localhost:5432/productmanager

---

## 3. Documentation API : Swagger

⚠️ **Attention**

Par défaut, Swagger UI sélectionne le serveur de production (`https://product-manager-vo2.xyz`) dans la liste "Servers" en haut à gauche.

➡️ Pensez à toujours sélectionner `http://localhost:3000` si vous voulez tester votre API en local, sans quoi vos requêtes partiront sur la prod !

- **Swagger dev :** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **Swagger production :** [https://product-manager-vo2.xyz/api-docs](https://product-manager-vo2.xyz/api-docs)

### Particularités :
- Certains endpoints nécessitent un **token JWT** (API sécurisées)
- Pour s’authentifier :
  1. Lance **`/auth/login`** (dans Swagger lui-même ou via Postman) avec un utilisateur existant
  2. Récupère le **`token`** retourné
  3. Clique sur le bouton **`"Authorize" (🔒)`**, colle le token (sans "Bearer ") et valide
  4. Tu peux maintenant appeler tous les endpoints sécurisés via Swagger UI
- Tous les types de requêtes/réponses, leurs paramètres et les exemples sont visibles dans l’IHM Swagger
- Les endpoints sont détaillés en live avec possibilité de tester à la volée

---

## 4. Accès Base de Données avec Prisma Studio

### Sur la DB cloud/production product-manager-vo2.xyz
```bash
DATABASE_URL=postgresql://product_manager_db_uw4u_user:XXXXX@dpg-d4cbtls9c44c738nmui0-a.oregon-postgres.render.com/product_manager_db_uw4u npx prisma studio
```
Cette commande ouvre Prisma Studio sur les données cloud du projet, pour examiner les tables et même éditer (avec prudence !).

---

## 5. Tester l’application

**En local (avec DB test docker)**
```bash
docker compose up -d db_test
npm run test:integration
```

**Via CI/GitHub Actions**
- À chaque push/pull request sur `master`, tous les tests s’exécutent en cloud (voir `.github/workflows/ci.yml`).
- Statut accessible dans l’onglet "Actions" du repo GitHub.

---


