# Tahap 1: build aplikasi React
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
ARG VITE_API_URL=https://votedel-api.example.com/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Tahap 2: sajikan dengan Nginx (SPA fallback + proxy API)
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
