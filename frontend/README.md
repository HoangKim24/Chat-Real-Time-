# Frontend - Chat Real Time

React + TypeScript + Vite client application.

For full project setup and architecture, see the root README:

- ../README.md

## Commands

- npm install
- npm run dev
- npm run build
- npm run preview
- npm run lint

## Default URLs

- Dev server: http://localhost:5173
- API base (default): http://localhost:5128/api
- Server API base (default): http://localhost:5128/api

The API base URL is configured in:

- src/services/api.ts

You can override API base with:

- VITE_API_BASE_URL

You can override server/workspace API base with:

- VITE_SERVER_API_BASE_URL

If you want to use remote API hosts, set both env vars to the same remote base URL.
