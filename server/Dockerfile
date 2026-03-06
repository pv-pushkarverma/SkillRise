FROM node:20-alpine

WORKDIR /app

# Install Chromium and required libraries
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Prevent Puppeteer from downloading Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install dependencies first (better Docker caching)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy project files
COPY --chown=appuser:appgroup . .

# Use non-root user
USER appuser

EXPOSE 3000

CMD ["node", "server.js"]