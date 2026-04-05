# Chat Real Time

A full-stack chat application with a modern React frontend and an ASP.NET Core backend.

## Project Overview

This repository contains:

- frontend: React + TypeScript + Vite + Zustand + Axios + Tailwind CSS
- backend: ASP.NET Core Web API (.NET 8) + Entity Framework Core
- root project: an ASP.NET Razor Pages scaffold (legacy shell)

Current focus is the frontend and backend folders.

## Features

- Authentication (login/register/profile update)
- Chat-oriented UI with sidebar layout and responsive behavior
- Workspace modal actions:
  - copy workspace invite text
  - rename workspace (frontend state + local persistence)
  - leave workspace (clear active workspace in client state)
- Settings page with appearance options:
  - dark/light theme
  - accent color
  - font size
  - preference persistence in localStorage
- Admin dashboard endpoints for demo stats/products/vouchers

## Tech Stack

Frontend:

- React 19
- TypeScript
- Vite 7
- Zustand
- React Router
- Axios
- Tailwind CSS 4

Backend:

- ASP.NET Core Web API (.NET 8)
- Entity Framework Core 8
- Oracle EF Core provider
- InMemory DB fallback for development
- Swagger

## Folder Structure

- frontend: client app
- backend: API service
- Program.cs (root): Razor Pages host scaffold
- Chat real time.sln: solution file

## Prerequisites

- Node.js 18+
- npm 9+
- .NET SDK 8.0+

Optional (for real DB mode):

- Oracle database connection

## Running the Application

### 1) Start backend API

From the backend folder:

- dotnet restore
- dotnet run

Default API URL:

- http://localhost:5128

Swagger:

- http://localhost:5128/swagger

### 2) Start frontend

From the frontend folder:

- npm install
- npm run dev

Default frontend URL:

- http://localhost:5173

## Build Commands

Frontend build:

- npm run build

Backend build:

- dotnet build backend/ChatApp.Api.csproj

Solution build:

- dotnet build "Chat real time.sln"

## Environment Configuration

Frontend API base URL is configured in:

- frontend/src/services/api.ts

Default value:

- http://localhost:5128/api

You can override with Vite env variable:

- VITE_API_BASE_URL

## Demo Account

- email: demo@chatflow.vn
- password: Demo@123456

## Notes and Limitations

- Workspace rename is currently persisted on client (localStorage), not yet synced to backend API.
- Backend currently exposes Auth and Admin controllers in this repo state.
- Backend automatically falls back to InMemory database when Oracle connection is not configured.

## Git Workflow

Typical flow:

- git checkout -b feature/your-change
- git add -A
- git commit -m "Describe your change"
- git push origin feature/your-change

## License

No license file is currently defined in this repository.
