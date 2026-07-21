# Next.js 16.2.9 orphaned streamed segment repro

Minimal reproduction for a bug filed against [vercel/next.js](https://github.com/vercel/next.js): a dynamic route with an ancestor `loading.tsx` ships raw HTML containing an orphaned streamed segment — a real, non-hydrated copy of the page's content that's never referenced by any `$RC(...)` swap call and never removed.

No `experimental.ppr`, no `cacheComponents`, no `dynamicIO` — see `next.config.ts`.

## Reproduce

```bash
npm install
npm run build
npm run start
curl -s http://localhost:3000/anyusername -o out.html
grep -oE 'id="S:[0-9]+"' out.html      # two segments: S:0, S:1
grep -o '\$RC("[^)]*")' out.html       # only one swap call, referencing S:0
grep -oE '<template id="P:[0-9]+"' out.html  # a postponed-hole template inside S:0
```

`S:0` (the segment that gets swapped in) is an empty postponed-hole placeholder. `S:1` (the orphan, never swapped, never removed) holds the real, fully-rendered page content.

## The trigger shape

- `app/[user]/loading.tsx` — an ancestor `loading.tsx`, which the App Router uses to auto-wrap the route segment in a `<Suspense>` boundary.
- `app/[user]/page.tsx` — `export const dynamic = "force-dynamic"`, reads `cookies()` before an async data fetch, renders real markup.

Environment: Next.js 16.2.9, React/React DOM 19.2.4, App Router, Turbopack.
