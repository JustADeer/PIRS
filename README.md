# PIRS Project Overview

PIRS is a full-stack application for reporting, viewing, and managing location-based incidents or posts. It consists of a React-based frontend (`omura`) and a FastAPI backend server (`omura-server`). The project is designed for interactive map-based reporting, user authentication, photo uploads, and forum-style discussions.

## Project Structure

### `/omura`

The frontend web application built with React, Vite, and Tailwind CSS.

- **`public/`**  
  Contains static assets (SVGs, images) served directly by Vite.

- **`src/`**  
  Main source code for the frontend.

  - **`assets/`**  
    Images and icons used throughout the app (e.g., map backgrounds, UI icons).
  - **`components/`**  
    Reusable React components:
    - `addmarker.tsx`: Handles adding markers to the map.
    - `api.tsx`: Axios instance for communicating with the backend.
    - `forums.tsx`: Forum/discussion UI component.
    - `photoupload.tsx`: Photo upload functionality.
  - **`pages/`**  
    Main application pages:
    - `login.tsx`: User login page.
    - `map.tsx`: Interactive map page for viewing and reporting.
  - Other files (`App.tsx`, `main.tsx`, etc.) set up the app and routing.

- **Config & Metadata Files**
  - `package.json`: Project dependencies and scripts.
  - `vite.config.ts`: Vite build configuration.
  - `tsconfig*.json`: TypeScript configuration.
  - `eslint.config.js`: Linting rules.
  - `README.md`, `USAGE.md`: Documentation.

---

### `/omura-server`

The backend server built with FastAPI and SQLite.

- **`main.py`**  
  Main FastAPI application handling API endpoints for reports and login.

- **`omura.db`**  
  SQLite database file for storing reports and user data.

- **`pyproject.toml`, `poetry.lock`**  
  Python dependencies and environment management (using Poetry).

- **`README.md`**  
  Backend setup and API documentation.

---

## Summary

- **Frontend (`omura`)**: Interactive map, user login, photo upload, forums.
- **Backend (`omura-server`)**: REST API for reports and login, SQLite database.

---

For usage instructions, see `omura/USAGE.md`. For backend API details, see `omura-server/README.md`.
