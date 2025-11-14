#!/bin/bash
# Script pour exécuter les migrations Prisma dans le container

echo "🔄 Attente de PostgreSQL..."
sleep 5

echo "🗄️  Exécution des migrations Prisma..."
npx prisma migrate dev --name init

echo "✅ Migrations terminées !"
