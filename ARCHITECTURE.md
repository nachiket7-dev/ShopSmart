# System Architecture and Design Document

This document fulfills the explanation requirements for the project, detailing the architecture, workflow, design decisions, and challenges encountered.

## 1. Architecture
ShopSmart is built using a cleanly separated **Client-Server Architecture**.
*   **Frontend (Client):** A Single Page Application (SPA) built universally with React and bundled via Vite. It is responsible for all UI rendering, state management (React Hooks), and client-side routing. It communicates asynchronously with the backend via RESTful endpoints.
*   **Backend (Server):** A streamlined REST API built with Node.js and Express.js. It handles business logic, data serving (currently mocked product data), and routing.

This separation of concerns ensures that the frontend and backend can be scaled, tested, and deployed entirely independently.

## 2. Workflow Pipeline
The development workflow is heavily automated using **GitHub Actions**.
*   **Continuous Integration (CI):** Every push and pull request triggers a pipeline that:
    1.  Downloads dependencies idempotently.
    2.  Runs the ESLint static code analyzer to catch syntax and logic errors.
    3.  Runs frontend unit tests (Vitest).
    4.  Runs backend unit and integration tests (Jest/Supertest).
    5.  Runs full browser-simulated End-to-End user flow tests (Playwright).
*   **Continuous Deployment (CD):** Merging code into the `main` branch triggers an automated SSH connection to an AWS EC2 instance, pulling the latest code, installing dependencies, building the production bundle, and restarting the Node processes via PM2.
*   **Dependency Management:** Dependabot is configured to scan the repository weekly to automatically suggest pull requests for outdated npm dependencies in both the `client` and `server` folders.

## 3. Design Decisions
*   **Tailwind CSS over Vanilla CSS:** Tailwind was chosen for the frontend because its utility-first approach drastically speeds up styling, naturally enforces a consistent design system (colors, padding scales), and results in a smaller final CSS bundle compared to traditional cascading stylesheets.
*   **Vite over Create-React-App:** Vite is utilized over legacy bundlers because of its incredibly fast Hot Module Replacement (HMR) during local development and highly optimized esbuild pre-bundling.
*   **Three-Tiered Testing Strategy:**
    *   *Unit Testing (Vitest/Jest):* Used for fast, isolated tests to ensure individual UI components and backend functions behave as expected (e.g., handling Loading vs Error UI states).
    *   *Integration Testing (Supertest):* Used to ensure the Express routes correctly process network requests and return proper JSON payloads.
    *   *E2E Testing (Playwright):* Added as a rigorous final check that boots both the frontend and backend simultaneously, simulating the exact workflow of a real user discovering products.

## 4. Challenges
*   **Port Collisions (`EADDRINUSE`):** During active development, frequent restarts frequently caused the backend Express server to crash if the default port (`5001`) was still held by a zombie process. We resolved this programmatically by implementing dynamic port mapping in `index.js`, where the server automatically catches the `EADDRINUSE` fatal error and recurses to bind to the next available incremental port (`5002`, `5003`, etc.).
*   **Test Runner Conflicts:** Implementing E2E testing alongside Unit testing introduced a conflict where Vitest inherently executed the Playwright `.spec.js` files, resulting in pipeline failures. This was resolved by explicitly isolating the testing environments, adjusting the `vite.config.js` to strictly ignore the `e2e/` testing directory.
