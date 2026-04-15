# SmartExpense AI (AmakTech)

SmartExpense AI is a modern expense-tracking web app that helps you **track transactions**, **set budgets**, **visualize analytics**, and get **AI-powered insights** about your spending.

Built with **React + TypeScript + Vite**, styled with **Tailwind CSS**, and connected to a hosted REST API.

---

## Features

- **Authentication**
  - Register / Login
  - Protected routes (redirects to login when not authenticated)
  - Token handling + refresh flow

- **Dashboard**
  - Balance, income, and expense summary cards
  - Spending breakdown (pie chart)
  - Trends over time (line chart)

- **Transactions**
  - Add income/expense transactions
  - List all transactions
  - Delete transactions

- **Analytics**
  - Dedicated analytics page (charts/insights UI)

- **Budgets**
  - Budget management page

- **AI Insights**
  - Auto-generated insights + summary
  - Chat interface to ask questions and get AI responses

---

## Routes (App Pages)

Public:
- `/` — Landing page
- `/login` — Login page
- `/register` — Register page

Protected:
- `/dashboard`
- `/transactions`
- `/analytics`
- `/budgets`
- `/ai`

---

## Tech Stack

**Frontend**
- React (with TypeScript)
- Vite
- React Router
- Axios
- Recharts
- Tailwind CSS

**Backend API**
- Base URL: `https://smartexpense-api.onrender.com/api/v1`

---

## Getting Started

### 1) Clone the repository
```bash
git clone https://github.com/alfred2504/amaktech-smartexpense-ai.git
cd amaktech-smartexpense-ai
```

### 2) Install dependencies
```bash
npm install
```

### 3) Run the development server
```bash
npm run dev
```

### 4) Build for production
```bash
npm run build
```

### 5) Preview the production build
```bash
npm run preview
```

---

## Environment / Configuration

This project currently uses a fixed API base URL in the frontend:

- `src/api/api.ts` sets:
  - `baseURL: https://smartexpense-api.onrender.com/api/v1`

If you want to use a different backend (local/dev/staging), update the `baseURL` in `src/api/api.ts`.

---

## Authentication Notes

- The app stores auth information in `localStorage` (e.g. `token`, `refreshToken`, `user`).
- Requests automatically attach `Authorization: Bearer <token>`.
- When a request returns `401`, the app attempts to refresh the token; if refresh fails it clears storage and redirects to `/login`.

---

## Project Structure (high level)

- `src/App.tsx` — Routes (public + protected)
- `src/pages/*` — Application pages (Dashboard, Transactions, AI, etc.)
- `src/components/*` — UI + layout components (ProtectedRoute, charts, cards)
- `src/api/api.ts` — Axios client + auth interceptors

---

## Credits

© SmartExpense AI — Built by **AmakTech**
