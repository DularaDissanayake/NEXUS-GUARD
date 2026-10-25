# Nexus Guard

Nexus Guard is a React and Vite application for identifying suspicious messages, links, and websites.

## Backend connection

Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` to the running backend URL. The frontend expects:

- `POST /predict` with `{ "text": "..." }`, returning `severity`, `phishing_probability`, and `confidence`.
- `POST /check-url` with `{ "url": "https://..." }`, returning `domainAge`, `ssl`, and `blacklist` result objects.

The backend must allow requests from the Vite development origin (normally `http://localhost:5173`) through CORS.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
