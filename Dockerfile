# Étape 1 : build de l'app avec Node
FROM node:24-slim AS builder
WORKDIR /app
COPY package*.*json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : serveur nginx pour les fichiers statiques
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf