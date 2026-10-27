// Handles all requests for Puck AI
// Learn more: https://puckeditor.com/docs/ai/getting-started
import type { NextRequest } from "next/server";
import { puckHandler } from "@puckeditor/cloud-client";

// Marketing site (puck.config.tsx)
const marketingAi = {
  context:
    "We are DRUO, a pay-by-bank payment method. Customers pay businesses directly from their bank account, without cards or extra apps. You create DRUO marketing pages: clear, friendly, trustworthy fintech copy.",
  designMode: {
    // Allow AI to generate new components using "design mode"
    // Learn more: https://puckeditor.com/docs/ai/design-mode
    allowed: true,
    instructions: `
    #### Brand

    * Font: Plus Jakarta Sans (already loaded as var(--font-jakarta))
    * Primary / buttons: \`#007881\` (teal), white text, 8px radius, 51px tall
    * Mint section background: \`#DFF3F3\`
    * Sand section background: \`#F5F4F1\`
    * Dark section background: \`#0A0A0A\` with white text
    * Body text: \`#333333\`, 18px/30px
    * Headings: 700 weight; H2 38px/42px, H3 26px/36px
    * Content width: 1245px, centered; images use 20px rounded corners
    `,
  },
};

// Merchant dashboard (platform.config.tsx), tagged by the editor's AI plugin
const platformAi = {
  context:
    "We are DRUO, a pay-by-bank payment method. You build pages for the DRUO merchant dashboard, where businesses track bank payments, payouts, customers and connected bank accounts. Pages are dense, scannable and data-first: a PageHeader, then Grids of cards. Use realistic but fictional merchants, customers, amounts (USD) and transaction IDs.",
  designMode: {
    allowed: true,
    instructions: `
    #### Dashboard UI

    * Compact: 13px/20px body text, 12px captions, 11px uppercase table headers
    * Cards: white, 1px border \`#E7E6E2\`, 10px radius, 14px 16px padding, no shadows
    * Page background: \`#F6F6F4\`; grid gaps 12px
    * Primary: \`#007881\` (teal); mint \`#DFF3F3\`; ink \`#1D1D1D\`; muted \`#6F6F6B\`
    * Status: success \`#187A43\` on \`#E3F6EA\`, pending \`#9A6411\` on \`#FDF1D6\`, failed \`#C53030\` on \`#FDE8E8\`
    * Numbers use tabular figures; buttons are 32px tall with 7px radius
    * New components must fit inside a Grid cell and fill its width
    `,
  },
};

const handleRequest = async (request: NextRequest): Promise<Response> => {
  const surface =
    request.method === "POST"
      ? await request
          .clone()
          .json()
          .then((body) => body?.surface)
          .catch(() => undefined)
      : undefined;

  return puckHandler(request, {
    ai: surface === "platform" ? platformAi : marketingAi,
  });
};

export const DELETE = handleRequest;
export const GET = handleRequest;
export const POST = handleRequest;
