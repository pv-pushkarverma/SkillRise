FROM node:20-alpine

WORKDIR /app

# Install Chromium runtime deps required by Puppeteer in Alpine
RUN apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont

# Create non-root user and group early
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source code with correct ownership
COPY --chown=appuser:appgroup . .

# Switch to non-root user
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]
