# Omura Frontend Usage Guide

Welcome to the Omura Frontend! This guide will help you get started with running, developing, and using the Omura web application.

## Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

## Installation

1. Open a terminal in the `omura` directory.
2. Install dependencies:
   ```powershell
   npm install
   ```
   or
   ```powershell
   yarn install
   ```

## Running the Development Server

1. Start the development server:
   ```powershell
   npm run dev
   ```
   or
   ```powershell
   yarn dev
   ```
2. Open your browser and navigate to `http://localhost:5173` (default Vite port).

## Building for Production

1. Build the app:
   ```powershell
   npm run build
   ```
   or
   ```powershell
   yarn build
   ```
2. The production-ready files will be in the `dist` folder.

## Project Structure

- `src/` - Main source code
  - `components/` - React components
  - `pages/` - Application pages (e.g., login, map)
  - `assets/` - Images and icons
- `public/` - Static files
- `vite.config.ts` - Vite configuration
- `tsconfig*.json` - TypeScript configuration

## Features

- Interactive map page
- User login
- Photo upload
- Forum discussions

## Customization

- Update styles in `src/App.css` and `src/index.css`.
- Add new pages in `src/pages/`.
- Add new components in `src/components/`.

## Troubleshooting

- If you encounter issues, ensure your Node.js version is compatible.
- Delete `node_modules` and run `npm install` again if dependencies are broken.

## License

See the main `README.md` for license information.

---

For more details, refer to the main README or contact the project maintainers.
