FROM node:20-alpine

WORKDIR /app

# Create non-root user and group early
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source code with correct ownership
COPY --chown=appuser:appgroup . .

# Switch to non-root user
USER appuser

EXPOSE 3000
CMD ["node", "server.js"]