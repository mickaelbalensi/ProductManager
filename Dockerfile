FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# Script de démarrage avec migrations
COPY start.sh ./
RUN chmod +x start.sh

CMD ["./start.sh"]
