# landship-proposal-generator

The free **Proposal Generator** — Landship.ca's top-of-funnel lead magnet. A prospect enters a few
details about a job and gets a polished, ready-to-send proposal in seconds, powered by Claude.

Built with Next.js (App Router, TypeScript) + the Anthropic SDK. Deploys on Vercel.

## How it works
- `app/page.tsx` — the form (business, client, project type, scope, budget).
- `app/api/generate/route.ts` — server route that calls Claude with a **prompt-cached** system
  prompt and returns Markdown.

## Run locally
```bash
npm install
cp .env.example .env.local   # set ANTHROPIC_API_KEY
npm run dev
```
Open http://localhost:3000.

## Deploy
Import the repo in Vercel and set `ANTHROPIC_API_KEY` in the project env. Never commit a real key —
`.env*` is gitignored.

## Notes
- Model: `claude-sonnet-4-6` (cost-effective for a public tool). Swap in `route.ts` if needed.
- The system prompt is cached (`cache_control: ephemeral`) so repeat generations are cheaper.

## Next steps
- Capture the user's email before showing the proposal (lead capture).
- Add PDF export and a "Landship can automate sending this" upsell CTA.
