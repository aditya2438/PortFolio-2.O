# Aditya Singh Chouhan — Portfolio 2.0

Interactive full-stack developer portfolio built by **Aditya Singh Chouhan** (Software Developer & Java Backend Engineer — Ujjain / Indore, MP, India).

**Live Website:** [aditya-portfolio-mocha-zeta.vercel.app](https://aditya-portfolio-mocha-zeta.vercel.app/)  
**Repository:** [github.com/aditya2438/PortFolio-2.O](https://github.com/aditya2438/PortFolio-2.O)  
**GitHub Profile:** [github.com/aditya2438](https://github.com/aditya2438)  
**Vercel Project:** [vercel.com/aditya2438/aditya-portfolio](https://vercel.com/aditya2438/aditya-portfolio)

---

## Highlights & Features

- **Liquid Glassmorphism & Water-Flow Canvas**: Custom quadratic-spline canvas backdrop with pointer deflection, refractive spotlight lens, and multi-accent studio themes (`Aurora Cyan`, `Solar Sunset`, `Emerald Matrix`, `Royal Amethyst`).
- **Interactive Work Showcases**: Architectural breakdowns for **FairCart** (5-service Java 21 / Spring Boot 3.3 / Apache Kafka DLQ / sub-25ms Redis / PostgreSQL 3NF platform) and **FixOra** (Haversine geo-routing marketplace across 17 normalized 3NF MySQL 8.0 tables).
- **Skills Matrix & Team Fit Builder**: Filterable 20-skill radar, fluency inspector, and live team compatibility calculator.
- **Full Resume Workflow**: Built-in interactive resume viewer, direct PDF preview tab, new-tab view (`/Aditya_Chouhan_Resume.pdf`), and single-click PDF attachment download (`/api/resume/download`).
- **Direct Inbox & WhatsApp Dispatch (`#contact`)**: Validated, XSS-sanitized contact endpoint backed by **Resend** (`POST /api/contact` on both Vercel Serverless Functions and local Express) with one-click Gmail compose & WhatsApp fallback.
- **PWA Support & Command Palette**: Installable Web App Manifest, Service Worker with `NetworkOnly` API routing, `Cmd/Ctrl + K` quick navigator, and an interactive Bug Smasher mini-game.

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide Icons |
| Backend / API | Vercel Serverless Functions (`api/*.ts`), Express (`server.ts`) |
| Email Delivery | Resend REST API (`RESEND_API_KEY`) + FormSubmit fallback |
| PWA & Tooling | `vite-plugin-pwa` (Workbox), Node.js `node:test`, ESLint / `tsc` |

---

## Project Structure

```text
├── api/
│   ├── contact.ts          # Vercel Serverless POST /api/contact (Resend + fallback)
│   ├── health.ts           # Vercel Serverless GET /api/health
│   └── resume.ts           # Vercel Serverless GET /api/resume & /api/resume/download
├── public/
│   ├── Aditya_Chouhan_Resume.pdf
│   ├── aditya-profile.jpg
│   └── manifest.json
├── src/
│   ├── components/         # Hero, Work, Skills, Journey, Contact, ResumeModal, Arcade
│   ├── data/               # Profile, projects, skills, education & certifications
│   └── utils/              # Pure logic, validation, sanitization & unit tests
├── server.ts               # Local development & Node production server
├── vercel.json             # Vercel SPA + serverless routing & cache headers
├── LICENSE                 # MIT License — Aditya Singh Chouhan
└── README.md
```

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Add your RESEND_API_KEY inside .env

# 3. Start full-stack dev server (http://localhost:3000)
npm run dev

# 4. Type-check, build & run tests
npm run lint
npm run build
npx tsx --test src/utils/portfolioLogic.test.ts src/server.integration.test.ts
```

---

## Deploying on Vercel

1. Connect `https://github.com/aditya2438/PortFolio-2.O` to Vercel (`vercel.com/aditya2438/aditya-portfolio`).
2. Open **Project Settings → Environment Variables** and add:
   - `RESEND_API_KEY` = your Resend API key (`re_...`) for **Production**, **Preview**, and **Development**.
3. Trigger a **Redeploy** so Vercel bundles `api/contact.ts`, `api/health.ts`, `api/resume.ts`, and `vercel.json`.

---

## Contact

- **Email:** [adityachouhan2446@gmail.com](mailto:adityachouhan2446@gmail.com)
- **WhatsApp / Phone:** +91 78802 09425
- **GitHub:** [@aditya2438](https://github.com/aditya2438)
- **LinkedIn:** [in/adityachouhan24](https://www.linkedin.com/in/adityachouhan24)
- **LeetCode:** [@kX69jmDS30](https://leetcode.com/u/kX69jmDS30/)

---

## License

Licensed under the [MIT License](./LICENSE) — Copyright © 2026 **Aditya Singh Chouhan**.
