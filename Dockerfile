FROM node:24.14.1-bullseye-slim AS builder
WORKDIR /app

# Use Corepack to ensure pnpm is available
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies (including devDependencies) and build
COPY package.json pnpm-lock.yaml ./
# Install without running package build scripts to avoid interactive approval in CI/Docker
# This avoids the `pnpm approve-builds` prompt which fails non-interactively.
RUN pnpm install --frozen-lockfile --prod=false --ignore-scripts
COPY . ./
RUN pnpm run build

FROM node:24.14.1-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Ensure pnpm is available in runtime image (optional)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only what's needed to run the built app
COPY package.json pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh
COPY --from=builder /app/.env.example ./

EXPOSE 5000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
