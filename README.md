# Agent Kingdom (MVP)

Agent Kingdom turns AI agents into a city-builder + RPG productivity experience. The MVP ships with a Supabase-ready schema, mock seed data, and a streaming chat API endpoint.

## Tech Stack
- **Next.js (App Router) + TypeScript**
- **TailwindCSS** for styling
- **shadcn/ui-style primitives** (Button, Badge)
- **Zustand** state management
- **Supabase** (auth + database) with mock mode fallback
- **Framer Motion** for animations
- **Recharts** for future charts

## Architecture Overview
- `app/` routes render the map, agent chat, missions, skills, inventory, and settings.
- `components/` contains reusable UI primitives and feature components (MapGrid, RPGChat, MissionPanel, SkillTree).
- `lib/data/seed.ts` provides mock data so the UI works without Supabase configured.
- `lib/state/store.ts` manages game state (missions, XP, resources, skill points).
- `app/api/chat/route.ts` proxies to OpenAI-compatible APIs or returns mock responses.
- `lib/db/schema.sql` defines Supabase tables for profiles, agents, missions, resources, and skills.
- `lib/db/seed.ts` provides a helper to seed Supabase with the mock data.

## Supabase Schema
See `lib/db/schema.sql` for SQL migrations. Key tables:
- `users`, `agents`, `missions`, `resources`
- `skills`, `user_skills`

## Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure env (optional for live Supabase + OpenAI):
   ```bash
   cp .env.example .env.local
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not set, the app uses mock data.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional)
- `OPENAI_API_KEY`
- `OPENAI_BASE_URL` (optional)

## Mock Mode
Mock mode is enabled automatically when Supabase credentials are absent. The `/api/chat` route returns deterministic responses for the RPG chat.
