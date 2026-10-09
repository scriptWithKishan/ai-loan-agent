# Loan Against Property (LAP) AI Voice Agent — Production Edition

A production-ready conversational AI voice qualification system for **Loan Against Property (LAP)** built with **TanStack Start (Full-stack TypeScript)**, deployed to **Vercel**, powered by **Retell AI (WebRTC & Telephony)**, **Google Gemini 2.5 Flash**, and **Neon Serverless PostgreSQL (with pgvector)**.

---

## 🌟 Key Features

1. **Deterministic Eligibility Engine (`src/services/eligibility.ts`)**
   - Strictly enforces the 4 hard preliminary qualification rules in TypeScript code:
     - **Property Type**: Residential, Commercial, or Industrial = eligible. Agricultural land = immediate polite disqualification.
     - **Original Documents**: Physical original title deeds must be available.
     - **Loan Amount**: Preliminary program limit capped at **₹75,00,000 (₹75 Lakhs)**.
     - **Income Mode**: Income must be credited via Bank (NEFT/RTGS/Salary Account). Cash-based income = immediate disqualification.
   - Collects Market Valuation and Requested Tenure for loan specialist follow-up.
2. **Sub-Second Voice Conversational UX**
   - In-browser low-latency WebRTC audio via `retell-client-js-sdk`.
   - Real-time live transcript feed with speaker role indicators.
   - Dynamic 7-point visual progress checklist with instant updates upon tool evaluation.
3. **Automated Provisioning (`pnpm run retell:sync`)**
   - Zero-toil setup script that registers the Retell LLM with Google Gemini Flash, tools (`check_eligibility`, `query_rag_knowledge`, `end_call`), and voice persona.
4. **Vercel & Serverless-Ready Architecture**
   - Full-stack TanStack Start running on Nitro, natively optimized for Vercel Functions.
   - Neon Serverless PostgreSQL with Drizzle ORM and `pgvector` for semantic knowledge retrieval.
5. **Bilingual Personas & Strict Identity Rules**
   - Seamlessly speaks English or Hindi with strict gendered grammatical consistency (e.g. "बोल रही हूँ" vs "बोल रहा हूँ").

---

## 🏗️ Architecture

```
User (Browser WebRTC) <──> Retell AI Cloud (STT + TTS) <──> Gemini 2.5 Flash
                                    │
                                    │ (Webhook / Custom Tool execution)
                                    ▼
                      Vercel Serverless / TanStack Start
                      ├── /api/tools/check-eligibility
                      ├── /api/tools/query-rag
                      └── /api/webhooks/retell
                                    │
                                    ▼
                      Neon PostgreSQL (Drizzle ORM + pgvector)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20+ (v24 recommended)
- **pnpm**: v11+
- **Retell AI API Key**: Sign up at [Retell AI](https://beta.retellai.com/)
- **Google Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)
- **Neon Database**: Free serverless Postgres database from [Neon](https://neon.tech/)

### 2. Environment Configuration
Copy the template `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your secrets:
```env
# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@ep-something.us-east-2.aws.neon.tech/neondb?sslmode=require

# Retell AI
RETELL_API_KEY=key_xxxxxxxxxxxxxxxx
RETELL_AGENT_ID=agent_xxxxxxxxxxxx # (Auto-filled by pnpm run retell:sync)

# Google Gemini API
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxx

# App Base URL (Used for Webhook Callbacks)
APP_URL=http://localhost:3000

# Security & Business Settings
ADMIN_PASSCODE=admin123456
COMPANY_NAME="Sunrise Capital"
DEFAULT_LANGUAGE="English"
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Push Database Schema & Seed RAG Knowledge
```bash
# Push schema to Neon
pnpm run db:push

# Seed LAP guidelines and FAQs with vector embeddings
pnpm run rag:seed
```

### 5. Provision Retell AI Agent Automatically
Run the sync script to automatically register your LLM prompt, custom tools, and agent in Retell AI:
```bash
pnpm run retell:sync
```
*Note: This automatically creates your Retell Agent and sets `RETELL_AGENT_ID` in your `.env`.*

### 6. Start Development Server
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Run the Vitest automated test suite:
```bash
pnpm test
```
Runs 19 deterministic tests covering:
- Pass/fail boundary conditions for the ₹75 Lakhs limit.
- Immediate disqualification on agricultural land, missing deeds, or cash income.
- Indian currency normalization (Lakhs, Crores, Hindi word numbers like "pachattar lakh").
- RAG cosine vector similarity and keyword search fallbacks.

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Go to the **Vercel Dashboard** and click **Add New Project**.
3. Select your repository. Vercel automatically detects the Vite/Nitro project settings.
4. Add the following **Environment Variables** in Vercel:
   - `DATABASE_URL`
   - `RETELL_API_KEY`
   - `RETELL_AGENT_ID`
   - `GEMINI_API_KEY`
   - `ADMIN_PASSCODE`
   - `APP_URL` (Set to `https://<your-project>.vercel.app`)
5. Click **Deploy**.
6. After your first deployment, re-run `pnpm run retell:sync` locally with `APP_URL=https://<your-project>.vercel.app` so Retell routes webhook tools to your live Vercel production URL!
