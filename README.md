# DRUO clone: Puck + Puck AI

A demo clone of the [druo.com](https://druo.com/en/) home page, built as a [Puck](https://puckeditor.com) page builder with the [Puck AI](https://puckeditor.com/docs/ai/overview) copilot. It also includes a second, separate config for compact **merchant dashboard** layouts, to show how one app can serve two very different editing experiences.

The app was scaffolded with:

```sh
pnpx @puckeditor/cli init --yes --framework next --name druo-clone --ai --package-manager pnpm
```

> **Demo only.** This project isn't affiliated with DRUO. The logo, photos and product images are loaded straight from druo.com and belong to DRUO. Marketing copy has been rewritten, and all dashboard data (merchants, customers, transactions) is made up. Every page is set to `noindex`.

## Quick start

1. **Install and run:**

   ```sh
   pnpm install
   pnpm dev                # or: pnpm dev --port 3150 if 3000 is taken
   ```

2. **Open a page, or add `/edit` to its URL to open the editor:**

   | Page                | View                                                                         | Edit                                                                                   |
   | ------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
   | Marketing home      | [/](http://localhost:3000)                                                   | [/edit](http://localhost:3000/edit)                                                    |
   | Dashboard: Overview | [/platform](http://localhost:3000/platform)                                  | [/platform/edit](http://localhost:3000/platform/edit)                                  |
   | Dashboard: Payments | [/platform/payments](http://localhost:3000/platform/payments)                | [/platform/payments/edit](http://localhost:3000/platform/payments/edit)                |
   | Dashboard: Payouts  | [/platform/payouts](http://localhost:3000/platform/payouts)                  | [/platform/payouts/edit](http://localhost:3000/platform/payouts/edit)                  |

3. **Edit and publish.** Drag blocks in from **Blocks** in the left sidebar, click any text on the canvas to change it, and use the right-hand panel for links, images and settings. Click **Publish** to save. The page is written to `database.json`, and the view URL shows the new version.

4. **Make a new page.** Open `/<any-path>/edit` and publish. Paths under `/platform` start with the dashboard blocks. All other paths use the marketing blocks.

## AI quick start

The **AI** panel, the last item in the editor's left sidebar, needs a Puck API key. Without one, everything else works, but the chat answers every prompt with `No Puck API key specified`.

1. **Add a key** using either option:

   - Let the CLI log in to Puck Cloud and write the key for you. From this folder, run the command, then approve the login in your browser:

     ```sh
     npx @puckeditor/cli connect
     ```

   - Or [create a key](https://cloud.puckeditor.com/api-keys) and add it to `.env.local` yourself:

     ```sh
     PUCK_API_KEY=your-api-key
     ```

2. **Restart the dev server** so Next.js loads `.env.local`.

3. **Prompt.** Open an editor, click **AI**, type a prompt and press Enter. For example:

   - On `/edit`: "Add a section about paying utility bills with autopay, in the same style as the rest of the page"
   - On `/platform/edit`: "Add a row with a refunds chart and a list of the five largest payments this week"

4. **Publish** to keep the result.

The marketing editor starts in **design mode**, where the AI can create new components. The dashboard editor starts in **assembly mode**, where it builds only from the existing blocks. Both can be switched in the chat box. [Puck AI](#puck-ai) explains how each surface gets its own business context.

### Reset the content

All four pages are seeded by a script:

```sh
node scripts/build-database.mjs
```

This **overwrites `database.json`**, including anything published from the editor. Edit the script, not `database.json`, to change the starting content.

## How it fits together

There are two Puck configs. `lib/configs.ts` chooses between them by path, so the renderer and the editor always use the same one:

- `/platform` and anything under it → `platform.config.tsx` (dashboard)
- every other path → `puck.config.tsx` (marketing site)

```ts
// lib/configs.ts
export const isPlatformPath = (path: string) => path === "/platform" || path.startsWith("/platform/");
export const getConfig = (path: string) => (isPlatformPath(path) ? platformConfig : marketingConfig);
```

The request flow is unchanged from the CLI recipe:

1. A URL ending in `/edit` is rewritten by `proxy.ts` to the editor route (`app/puck/[...puckPath]`). The editor loads the saved page, or an empty one for a new path.
2. **Publish** posts the page JSON to `/api/pages`, which writes it to `database.json` and clears the Next.js cache for that path.
3. The catch-all route (`app/[...puckPath]`) reads the page and renders it with `<Render>`.
4. AI chat requests go from the editor's AI plugin to `/api/puck`. That route forwards them to Puck Cloud with your API key and the business context for the surface being edited (see [Puck AI](#puck-ai)).

### Files

| File                                | Purpose                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `puck.config.tsx`                   | Marketing site config: sections, cards, buttons and the site header/footer root.                          |
| `platform.config.tsx`               | Dashboard config: app shell root, grid, cards and data blocks.                                            |
| `lib/configs.ts`                    | Picks the config for a path.                                                                              |
| `components/blocks/home.tsx`        | Marketing section and card components.                                                                    |
| `components/site/shell.tsx`         | Marketing header (sticky, with mobile menu) and footer.                                                   |
| `components/platform/blocks.tsx`    | Dashboard components.                                                                                     |
| `components/platform/shell.tsx`     | Dashboard frame: sidebar, top bar, content area.                                                          |
| `components/platform/icons.tsx`     | Small stroke icon set used by the dashboard (`ICON_OPTIONS` feeds the icon select fields).                |
| `lib/site.ts`                       | Marketing nav and footer links (pointing at live druo.com pages), logo URLs.                              |
| `lib/fonts.ts`                      | Plus Jakarta Sans via `next/font/google`, exposed as `--font-jakarta`.                                    |
| `app/styles.css`                    | Marketing styles (`d-` class prefix).                                                                     |
| `app/platform.css`                  | Dashboard styles (`p-` class prefix, scoped under `.p-app`).                                              |
| `app/[...puckPath]/`                | Renders published pages with the config for their path.                                                   |
| `app/puck/[...puckPath]/`           | The editor. Chooses the config and AI plugin for the path.                                                |
| `app/api/pages/route.ts`            | Saves published pages to `database.json`.                                                                 |
| `app/api/puck/[...all]/route.ts`    | Puck AI handler with separate marketing and dashboard context.                                            |
| `proxy.ts`                          | Rewrites `…/edit` URLs to the editor route.                                                               |
| `lib/get-page.ts`                   | Reads pages from `database.json`.                                                                         |
| `scripts/build-database.mjs`        | Seeds `database.json` with the four example pages.                                                        |

## Marketing site (`puck.config.tsx`)

A clone of the druo.com/en home page, matched against the live site at 1440px wide.

### Sections

| Component      | What it is                                                                     | Slots                     |
| -------------- | ------------------------------------------------------------------------------ | ------------------------- |
| `Hero`         | Mint hero with headline, intro, buttons, small print, customer photos, image.  | `actions` → `Button`      |
| `FeatureRow`   | Heading, intro and a three-column card row.                                    | `cards` → `FeatureCard`   |
| `Checkout`     | Two-column showcase with a phone mock-up and an in-store image.                | `actions` → `Button`      |
| `SplitBand`    | Full-width sand band with an image and rich-text copy.                         | `actions` → `Button`      |
| `DarkFeatures` | Black section with a centered heading and a 2×2 card grid.                     | `cards` → `FeatureCard`   |
| `CtaStrip`     | Centered call to action.                                                       | `actions` → `Button`      |
| `BusinessCard` | Rounded mint card for the business offering.                                   | `actions` → `Button`      |
| `Faq`          | FAQ list with expanding answers.                                               | `items` → `FaqItem`       |

### Items

- **`FeatureCard`**: image, title and text. It's used by both `FeatureRow` and `DarkFeatures` and takes its text colour from the section.
- **`FaqItem`**: question with a rich-text answer. On the site, clicking the row opens it. In the editor, the plus icon still toggles it, so the text stays editable.
- **`Button`**: label, link, style (`primary` teal, `white` or `sand`) and an optional extra-padding setting.

### Root

The root renders `SiteShell`: a sticky, translucent header and a black footer. Their links are code, not page data. Edit them in `lib/site.ts`.

### Design tokens

| Token        | Value                            |
| ------------ | -------------------------------- |
| Font         | Plus Jakarta Sans                |
| Teal         | `#007881`                        |
| Mint         | `#DFF3F3`                        |
| Sand         | `#F5F4F1`                        |
| Black        | `#0A0A0A`                        |
| Body text    | `#333333`, 18px/30px             |
| Headings     | H1 46/50, H2 38/42, H3 26/36, 700 |
| Content width | 1245px                          |

The layout breaks at 1300px (fluid columns), 1000px (single column, mobile menu) and 640px (smaller type).

## Dashboard example (`platform.config.tsx`)

A compact, data-dense config for a fictional DRUO merchant dashboard. Pages are a `PageHeader` followed by stacked `Grid`s of cards.

### Root (app shell)

The root renders `PlatformShell`: a black sidebar, a sticky top bar with search, a Live/Sandbox badge, notifications and an avatar, and the content area. Its fields are page settings in the editor:

| Field         | Purpose                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------- |
| `title`       | Browser tab title.                                                                          |
| `merchant`    | Name in the sidebar's merchant switcher (initials are generated).                           |
| `user`        | Signed-in user shown as the avatar.                                                         |
| `environment` | `live` or `sandbox` badge.                                                                  |
| `nav`         | Sidebar links: label, link and icon. The current page is highlighted automatically, and external links open in a new tab. |

### Layout blocks

- **`PageHeader`**: title and subtitle, plus an `actions` slot for buttons.
- **`Grid`**: 1–4 columns with a compact (12px) or comfortable (16px) gap. Its `items` slot accepts every card below.
- **`Panel`**: a titled card with a `body` slot for `DetailList`, `PlatformButton` and `Notice`.

Every card has a **Width in grid** field (`1`, `2`, `3` or `Full row`). Common patterns are a 4-column grid of `StatCard`s, and a 3-column grid with a 2-wide chart or table next to a 1-wide card.

### Data blocks

| Component           | What it shows                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `StatCard`          | Label, value, change (up, down or flat colouring), caption and a sparkline from comma-separated numbers. |
| `ChartCard`         | Area or bar chart from an array of label/value points, with a headline value.                  |
| `TransactionsTable` | Amount, ID, status pill (successful, pending, failed, refunded), customer, bank and date.       |
| `FilterBar`         | Segmented filter chips and a search box. Chips switch on the live page only.                   |
| `BalanceCard`       | Balance, linked account and an action, in dark, teal or mint.                                   |
| `BankAccounts`      | Connected accounts with on/off switches. Switches change on the live page only, not in the saved data. |
| `ActivityFeed`      | Recent events with icons by kind (payment, payout, refund, customer, alert).                    |

### Content blocks

- **`Notice`**: an info, success or warning banner with an optional link.
- **`DetailList`**: label/value rows, for example a payout schedule.
- **`PlatformButton`**: a 32px button in primary, secondary or ghost style, with an optional icon.

### Styling

`app/platform.css` keeps the dashboard compact: 13px/20px text, 12px captions, 32px buttons, 40px table rows, 10px card radius, hairline borders and tabular numbers. It reuses the marketing site's teal and mint on an off-white `#F6F6F4` background. Grids drop to two columns at 1180px. At 860px the sidebar becomes a slide-out menu, and at 600px everything stacks into one column.

### Add a dashboard page

1. Open `/platform/<name>/edit`. Any path under `/platform` gets the dashboard config, starting empty.
2. Add a `PageHeader` and some `Grid`s, or ask the AI ("Add a customers page with stats and a table of autopay customers").
3. **Publish**, then add the page to the `nav` root field on each page that should link to it. To make the link part of the seed data, add it to `platformRoot()` in `scripts/build-database.mjs`.

## Puck AI

Each surface gets its own AI setup:

| Surface   | Editor plugin (`app/puck/[...puckPath]/client.tsx`) | Default mode | Server context (`app/api/puck/[...all]/route.ts`)                                |
| --------- | --------------------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| Marketing | `aiPlugin`                                          | Design       | `marketingAi`: DRUO brand voice, marketing colours, type scale, 1245px width.    |
| Dashboard | `platformAiPlugin`                                  | Assembly     | `platformAi`: merchant dashboard, compact sizes, card styling, status colours.   |

The dashboard plugin tags every request with `prepareRequest`:

```ts
prepareRequest: (opts) => ({ ...opts, body: { ...opts.body, surface: "platform" } }),
```

The route reads that tag from a clone of the request body and passes the matching `ai` options to `puckHandler`. Both surfaces allow design mode. The dashboard starts in assembly mode because its pages are mostly built from existing blocks.

Some dashboard components also carry their own `ai.instructions` in the config, such as `PageHeader`, `Grid` and `StatCard`. These tell the AI how to use each block, for example "4 columns for stat rows". Add instructions to any component the same way.

## Editor conventions

These patterns are used in both configs. Follow them when adding components:

- **Text is edited in place.** The field helpers (`text`, `textarea`, `richtext`) set `contentEditable: true`. Links, image URLs and option fields stay in the sidebar. Because Puck can pass editable text as a React node, components type their text props as `ReactNode`.
- **Repeating items are slots, not arrays.** Cards, FAQ items and buttons are their own components inside a `slot` field, so they can be dragged, duplicated and edited one by one. Data that belongs to a single block, like table rows, chart points and sidebar links, stays as `array` fields.
- **Slot children are `inline: true` and attach `puck.dragRef` to their root element.** The slot's `className` (a grid or flex row) then lays out the same in the editor as on the site, with no wrapper divs.
- **Links don't navigate in the editor.** Both shells cancel anchor clicks when `puck.isEditing` is true.
- **Interactive controls on the canvas** need `registerOverlayPortal(el, { disableDrag: true })` so Puck's overlay doesn't swallow clicks. `FaqItem`'s toggle is an example. Controls that only matter on the live site, like filter chips and switches, are disabled while editing.
- **Rich text renders inside wrapper divs.** Use descendant selectors (`.d-rich p + p`), not child selectors.
- **CSS resets live in `:where()`** (for example `:where(.d-site) :where(h1, p) { margin: 0 }`) so a single component class always wins.

## Gotchas

- **Stale dev cache.** After changing what a server page passes to a client component, Turbopack can serve a stale cached render. You'll see errors like `Cannot read properties of undefined` from props that clearly exist. Stop the dev server, run `rm -rf .next` and start it again. Do the same after running `pnpm build` locally.
- **Static pages.** `app/[...puckPath]/page.tsx` uses `force-static`. Publishing clears the cache for that path, but pages that need request-time data (cookies, sessions) need that line removed.
- **The seed script overwrites published pages.** See [Reset the content](#reset-the-content).

## Before deploying to production

- **Protect the editor and APIs.** `/edit`, `/api/pages` and `/api/puck` are public. Add authentication, authorization and rate limits. `/api/puck` spends your Puck AI usage.
- **Set `PUCK_API_KEY`** in your hosting provider's environment variables if you use Puck AI. Without it, the site and editor still work but the AI chat doesn't.
- **Use a real database.** Replace `database.json` in `lib/get-page.ts` and `app/api/pages/route.ts`. Local files don't survive across server instances or serverless deployments.
- **Replace the borrowed assets.** Images and logos are hotlinked from druo.com, and site links point at druo.com.

## Learn more

- [Puck documentation](https://puckeditor.com/docs)
- [Component configuration](https://puckeditor.com/docs/integrating-puck/component-configuration)
- [Puck AI overview](https://puckeditor.com/docs/ai/overview)
- [Design mode](https://puckeditor.com/docs/ai/design-mode)
- [`puckHandler` reference](https://puckeditor.com/docs/api-reference/ai/cloud-client/puck-handler)
- [Puck CLI](https://puckeditor.com/docs/cli). Run `npx @puckeditor/cli docs ls` to browse the docs offline.
- [Puck Discord](https://discord.gg/D9e4E3MQVZ)
