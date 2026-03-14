# Stage 1 — build
FROM docker.io/library/node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build -- --configuration production

# Stage 2 — nginx
FROM docker.io/library/nginx:alpine
COPY --from=builder /app/dist/logistics-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80