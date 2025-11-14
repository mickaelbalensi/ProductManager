#!/bin/sh

echo "🚀 Starting Product Manager API..."

echo "📦 Applying database migrations..."
npx prisma migrate deploy

echo "✅ Starting the application..."
npm start
