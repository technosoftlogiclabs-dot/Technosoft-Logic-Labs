# Technosoft Logic Labs Marketing Site

Production-ready Next.js App Router website with a 3D Rubik-like cube for navigation and content panels.

## Stack

- Next.js (App Router) + TypeScript
- TailwindCSS
- React Three Fiber + drei (three.js)
- Zustand (UI state)
- Framer Motion (panel animation)

## Run locally

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:3000`

## Build

- `npm run build`
- `npm run start`

## Notes

- Contact form posts to `/api/contact` with honeypot and a simple rate-limit stub.
- API currently logs leads to console as placeholder behavior.
- The site supports `?panel=<tile-id>` deep links (example: `/?panel=services`).