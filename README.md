# ShopSmart E-Commerce Platform

ShopSmart is a modern, responsive e-commerce web application built to deliver a premium shopping experience.

## Tech Stack
*   **Frontend:** React, Vite, Tailwind CSS
*   **Backend:** Node.js, Express.js
*   **Testing:** Vitest (Frontend Unit), Jest & Supertest (Backend Unit/Integration), Playwright (End-to-End)
*   **CI/CD:** GitHub Actions (Linting, Tests, Dependabot, EC2 Deployment)

## Getting Started

### 1. Installation
The project features an idempotent installation script to easily setup all dependencies for both the frontend and backend without running redundant operations.
```bash
./install.sh
```

### 2. Running Locally
You will need two terminal windows to run both the frontend and the backend.

**Backend Server:**
```bash
cd server
npm run dev
```
*Note: The server defaults to port `5001`. If it is taken, it will automatically find the next available port.*

**Frontend Client:**
```bash
cd client
npm run dev
```
*Note: By default, the frontend proxies API requests to `http://localhost:5001`. If your backend started on a different port, you must start the client like this:*
```bash
VITE_API_URL=http://localhost:<NEW_PORT> npm run dev
```

### 3. Testing
This project embraces comprehensive testing coverage.
*   **Frontend Unit Tests:** `cd client && npm test`
*   **Backend Tests:** `cd server && npm test`
*   **End-to-End Tests:** `cd client && npm run e2e`

### 4. Code Quality
Linting and formatting are strictly enforced using ESLint and Prettier.
*   **Frontend:** `cd client && npm run lint`
*   **Backend:** `cd server && npm run format && npm run lint`

## Architecture & Design Decisions
Please refer to [ARCHITECTURE.md](./ARCHITECTURE.md) for a detailed breakdown of the system design, workflows, design decisions, and challenges faced during development.
