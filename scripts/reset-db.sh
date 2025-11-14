#!/bin/bash
echo "🗑️  Reset complet de la base de données..."

# Arrêter et supprimer les volumes
docker compose down -v

# Supprimer les anciennes migrations
rm -rf prisma/migrations/

echo "🚀 Redémarrage avec base propre..."
# Redémarrer
docker compose up -d db

echo "⏳ Attente PostgreSQL (10 secondes)..."
sleep 10

echo "📊 Création de la migration..."
# Créer la migration
docker compose exec app npx prisma migrate dev --name init_simple_user

echo "🔨 Rebuild de l'application..."
# Rebuild l'app
docker compose build --no-cache app
docker compose up -d

echo "✅ Reset terminé ! Test avec:"
echo "curl -X POST http://localhost:3000/users -H 'Content-Type: application/json' -d '{\"firstName\":\"John\",\"familyName\":\"Doe\",\"email\":\"john@example.com\"}'"
