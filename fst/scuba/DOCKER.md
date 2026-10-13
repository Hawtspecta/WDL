# Production Docker Guide

This guide details how to build, run, and monitor the containerized Next.js application using Docker and Docker Compose.

---

## 1. Architectural Highlights

- **Multi-Stage Build**: Separates dependency installation (`deps`), application build (`builder`), and production runtime (`runner`) to minimize final image footprint (~150MB vs >1GB).
- **Standalone Output**: Next.js automatically traces required dependencies into `.next/standalone`, eliminating unnecessary `node_modules` from the runtime image.
- **Layer Caching**: `package.json` and `package-lock.json` are copied and installed first so that code changes do not re-trigger dependency installation.
- **Non-Root Security**: The container executes under a dedicated non-root user and group (`nextjs:nodejs`, UID/GID `1001`).
- **Production Asset Serving**: Static assets (`public` and `.next/static`) are explicitly copied into the runtime container.
- **Health Check & Monitoring**: Built-in health check probes hitting `/api/health` verify runtime responsiveness.
- **Secrets Protection**: Comprehensive `.dockerignore` prevents `.env*`, `.git`, temporary artifacts, and sensitive files from being baked into images.

---

## 2. Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine (v20.10+)
- Docker Compose v2+

---

## 3. Quick Start with Docker Compose (Recommended)

### A. Build and Start the Application
Run the container in detached mode:
```bash
docker compose up --build -d
```

### B. Verify Container Status & Health Check
Check running containers and health status:
```bash
docker compose ps
```
The status will display `healthy` once the startup period passes and health checks succeed.

You can inspect detailed health logs with:
```bash
docker inspect --format='{{json .State.Health}}' scuba-app
```

Or query the endpoint directly from your host:
```bash
curl http://localhost:3000/api/health
```
Expected output:
```json
{"status":"healthy","timestamp":"2026-10-13T09:30:00.000Z","uptime":12.34}
```

### C. View Container Logs
Stream application logs in real time:
```bash
docker compose logs -f app
```

### D. Stop the Container
To stop and remove containers and networks:
```bash
docker compose down
```

---

## 4. Using Docker CLI Directly

### A. Build the Image
```bash
docker build -t scuba-app:latest .
```

### B. Run the Container
```bash
docker run -d \
  --name scuba-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  scuba-app:latest
```

### C. Inspect and Monitor
```bash
# Check container status
docker ps

# Check container health status
docker inspect --format='{{.State.Health.Status}}' scuba-app

# View logs
docker logs -f scuba-app

# Stop and remove container
docker stop scuba-app
docker rm scuba-app
```

---

## 5. Environment Variables & Secret Handling

- **Never commit `.env` or `.env.local` files to Git or bake them into the Docker image.**
- `.dockerignore` actively excludes all `.env*` files from the Docker context.
- Runtime environment variables should be supplied via:
  - Docker Compose `env_file` (automatically picks up `.env` or `.env.local` if present on host)
  - Environment flags in `docker run -e KEY=value` or `--env-file .env.local`
  - Container orchestration platforms (e.g., Kubernetes Secrets, AWS ECS Parameter Store, Cloud Run).
