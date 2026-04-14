# Agent ID — policy microsite

Next.js (App Router) site for the Agent ID policy research project: thesis-driven landing page, embedded interactive PoC, MDX blog, and Giscus comments.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local`. For production on Vercel, set `NEXT_PUBLIC_SITE_URL` to your deployment URL or custom domain.

### Giscus (comments)

1. Enable **GitHub Discussions** on the repo you use for comments.
2. Install the [giscus](https://github.com/apps/giscus) GitHub App on that repo.
3. Visit [giscus.app](https://giscus.app) and generate `repo`, `repoId`, `category`, and `categoryId`.
4. Add the four `NEXT_PUBLIC_GISCUS_*` variables in Vercel. Until they are set, blog posts show a configuration notice instead of the widget.

## Content

- Blog posts live in `content/blog/*.mdx` with YAML frontmatter (`title`, `date`, `author`, `description`).
- The interactive demo component is in `components/poc/ArchV5Poc.jsx` (copied from the standalone PoC repo; do not refactor for site updates).

## Deploy

Connect the repository to [Vercel](https://vercel.com): automatic builds on push. Add a custom domain when ready.

## Licence

Private / project policy as determined by SASH and authors.
