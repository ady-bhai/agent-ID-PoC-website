# Agent ID — policy microsite

Next.js (App Router) site for the Agent ID policy research project: thesis-driven landing page, embedded interactive PoC, and the policy memo.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local`. For production on Vercel, set `NEXT_PUBLIC_SITE_URL` to your deployment URL or custom domain.

## Content

- The interactive demo component is in `components/poc/ArchV5Poc.jsx` (copied from the standalone PoC repo; do not refactor for site updates).
- The policy memo lives in `app/memo/page.tsx` with supporting figures in `app/figures/`.

## Deploy

Connect the repository to [Vercel](https://vercel.com): automatic builds on push. Add a custom domain when ready.

## Licence

Private / project policy as determined by SASH and authors.
