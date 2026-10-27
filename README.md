# DRUO clone: Puck + Puck AI

A [Puck](https://puckeditor.com) clone of the [druo.com](https://druo.com/en/) home page, plus a separate example config for compact merchant dashboards. Scaffolded with `pnpx @puckeditor/cli init --ai`.

> Demo only, not affiliated with DRUO. Images and logos are hotlinked from druo.com, copy is rewritten, and dashboard data is made up. Pages are `noindex`.

## Quick start

```sh
pnpm install
pnpm dev
```

| Page                | View                                        | Edit                                                  |
| ------------------- | ------------------------------------------- | ----------------------------------------------------- |
| Marketing home      | [/](http://localhost:3000)                  | [/edit](http://localhost:3000/edit)                   |
| Dashboard: Overview | [/platform](http://localhost:3000/platform) | [/platform/edit](http://localhost:3000/platform/edit) |
| Dashboard: Payments | `/platform/payments`                        | `/platform/payments/edit`                             |
| Dashboard: Payouts  | `/platform/payouts`                         | `/platform/payouts/edit`                              |

Add `/edit` to any path to edit it or create a new page there, then **Publish** to save it to `database.json`. To reset all pages to the seed content, run `node scripts/build-database.mjs`. This overwrites anything you've published.

## AI quick start

The **AI** panel in the editor needs a Puck API key. Without one, the rest of the app still works.

1. Run `npx @puckeditor/cli connect` and approve the login in your browser. Alternatively, [create a key](https://cloud.puckeditor.com/api-keys) and add `PUCK_API_KEY=…` to `.env.local` yourself.
2. Restart `pnpm dev`.
3. Open an editor, click **AI** and enter a prompt.

## How it works

Two configs share one app. `lib/configs.ts` picks the config by path:

- `/platform/**` uses `platform.config.tsx` (dashboard).
- Every other path uses `puck.config.tsx` (marketing).

The rest is the standard CLI recipe. `proxy.ts` rewrites `…/edit` URLs to the editor, publishing posts to `/api/pages`, which writes to `database.json`, and `/api/puck` forwards AI requests to Puck Cloud.

| Path                         | Contents                                         |
| ---------------------------- | ------------------------------------------------ |
| `components/blocks`, `site`  | Marketing components, header and footer          |
| `components/platform`        | Dashboard components, app shell and icons        |
| `app/styles.css`             | Marketing styles (`d-` prefix)                   |
| `app/platform.css`           | Dashboard styles (`p-` prefix)                   |
| `lib/site.ts`                | Marketing nav and footer links                   |
| `scripts/build-database.mjs` | Seed content for all four pages                  |

## Marketing config

The sections are `Hero`, `FeatureRow`, `Checkout`, `SplitBand`, `DarkFeatures`, `CtaStrip`, `BusinessCard` and `Faq`. Repeating items are separate blocks that sit in slots: `FeatureCard`, `FaqItem` and `Button`. The header and footer come from code, not page data.

The design uses Plus Jakarta Sans, teal `#007881`, mint `#DFF3F3`, sand `#F5F4F1` and black `#0A0A0A`, in a 1245px content width.

## Dashboard config

- **Page settings:** merchant name, user, Live/Sandbox environment and sidebar links. The current page's sidebar link is highlighted automatically.
- **Layout:** `PageHeader`, `Grid` (1–4 columns) and `Panel`. Every card has a width setting of 1, 2 or 3 columns, or a full row.
- **Data:** `StatCard`, `ChartCard` (area or bar), `TransactionsTable`, `FilterBar`, `BalanceCard`, `BankAccounts` and `ActivityFeed`.
- **Content:** `Notice`, `DetailList` and `PlatformButton`.

## Puck AI

Each editor tags its requests. `app/api/puck/[...all]/route.ts` then sends the matching business context and design instructions:

- **Marketing** starts in design mode, where the AI can create new components.
- **Dashboard** starts in assembly mode, where it builds only from existing blocks. Its requests carry `surface: "platform"` (set with `prepareRequest`). Some dashboard components also carry their own `ai.instructions`.

## Conventions

- Text is edited on the canvas (`contentEditable`). Links and images stay in the sidebar.
- Repeating items are slot children marked `inline: true`, with `puck.dragRef` on their root element.
- Links don't navigate in the editor. Buttons that must stay clickable on the canvas use `registerOverlayPortal`.
- CSS resets are wrapped in `:where()` so component classes win.

## Troubleshooting

If the dev server throws errors about props that clearly exist, its cache is stale. Stop it and run `rm -rf .next`. Do the same after running `pnpm build` locally.

## Before deploying

- Add auth to `/edit`, `/api/pages` and `/api/puck`.
- Replace `database.json` with a real database.
- If you use Puck AI, set `PUCK_API_KEY` in your host's environment variables.
- Replace the assets borrowed from druo.com.
