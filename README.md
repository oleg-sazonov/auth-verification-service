# Auth Verification Service

Full-stack auth verification service with an Express backend ([backend/src/server.js](backend/src/server.js)) and a Vite React frontend scaffold.

## Prerequisites

-   Node.js 18+
-   npm 9+

## Installation

```bash
npm install
npm install --prefix backend
npm install --prefix frontend
```

## Development

```bash
# backend API with nodemon
npm run server

# frontend dev server (Vite) after you scaffold it
npm run frontend
```

## Production Build

```bash
npm run build
```

## Backend Only

```bash
npm run start
```

Health check available at `GET /health` on the backend.
