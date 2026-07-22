# My Dashboard — Tax Revenue Analytics & Forecasting

A web dashboard for analyzing and forecasting tax revenue dynamics of self-employed individuals (NPD) and sole proprietors (IP) in Russia, built as the frontend of a bachelor's thesis (VKR) project.

> **Scope note:** the system is built around the taxation rules of the **Russian Federation** (self-employment tax, USN, OSNO, patent regimes for sole proprietors), and all monetary values shown in the interface and reports are in **Russian rubles (RUB)**.

This repository contains the client application only. It communicates with a separate [Flask backend](https://github.com/NinaBlinova/DiplomaProject.git) that handles authentication, data aggregation, and the machine learning forecasting service ([LinearRegression, LightGBM, XGBoost]).

## Screenshots

**Login screen**
*(insert screenshot — Figure 3 in the thesis)*

**Dashboard — main page**
*(insert screenshot — Figure Б.1 in the thesis)*

**Forecasting models**
*(insert screenshot — Figure Б.2 in the thesis)*

## Features

- **Dashboard** — income, tax, and transaction dynamics as line charts, donut charts, and bar charts, plus an income-vs-transactions correlation chart, all computed for median and total values across taxpayers.
- **Filtering** — by date range/period, tax regime, and scope (all taxpayers or a single one by INN).
- **Taxpayers** — searchable table of taxpayers with a detail view (passport data, registration address, employee count) and add/delete actions.
- **Forecasting models** — browse available ML models with quality metrics (R², MAE, RMSE) and switch the active model used for predictions.
- **Report generation** — export the currently displayed dashboard data as a `.docx` report.
- **Settings** — profile editing, avatar upload, password change, and (for admins) managing system members and their access.
- **Internationalization** — Russian and English UI via `@nuxtjs/i18n`.
- **Light/dark theme** and adjustable accent color.

## Tech stack

- [Nuxt 4](https://nuxt.com/) + TypeScript
- [Nuxt UI](https://ui.nuxt.com/) for interface components
- [Unovis](https://unovis.dev/) for interactive charts
- [@nuxtjs/i18n](https://i18n.nuxtjs.org/) for localization
- [Tailwind CSS](https://tailwindcss.com/)

## Project structure

```
app/
├── components/       # UI components (home dashboard, taxpayers, models, settings...)
├── composables/       # Reusable client-side logic (filters, stats, auth, report generation)
├── layouts/           # Application layout (sidebar, navbar)
├── middleware/         # Route guards (auth)
├── modals/            # Modal dialogs (register user, edit user, user logs)
├── pages/             # File-based routes (/, /login, /models, /profile, /taxpayers, /settings/*)
├── types/             # Shared TypeScript types
└── utils/             # Helper utilities
server/
└── api/               # Nuxt server routes proxying requests to the Flask backend
i18n/
└── locales/           # ru.json / en.json translation files
```

## Getting started

### Prerequisites

- Node.js
- npm
- A running instance of the [backend service](#) (the app expects it at the URL configured below)

### Installation

```bash
npm install
```

### Configuration

The backend URL is set via `runtimeConfig.public.backendUrl` in `nuxt.config.ts` (defaults to `http://localhost:5002`). Override it with an environment variable if needed:

```bash
NUXT_PUBLIC_BACKEND_URL=http://localhost:5002
```

### Run in development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Other commands

```bash
npm run build       # production build
npm run preview     # preview the production build
npm run lint        # lint the codebase
npm run typecheck   # run TypeScript type checking
```

## Related repositories

- Backend (Flask + ML forecasting service): *link here*

## About

This project is the frontend part of a bachelor's thesis (ВКР) on the analysis and forecasting of tax revenue dynamics for self-employed individuals and sole proprietors using machine learning.
