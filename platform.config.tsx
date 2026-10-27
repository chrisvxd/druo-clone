// An example config for a DRUO merchant platform: compact, dashboard-style
// layouts built from a grid, cards and data blocks. Pages under /platform use
// it (see lib/configs.ts); the marketing site uses puck.config.tsx.

import type { ComponentConfig, Config, Field } from "@puckeditor/core";
import {
  ActivityFeed,
  BalanceCard,
  BankAccounts,
  ChartCard,
  DetailList,
  FilterBar,
  Grid,
  Notice,
  PageHeader,
  Panel,
  PlatformButton,
  StatCard,
  TransactionsTable,
} from "./components/platform/blocks";
import { ICON_OPTIONS } from "./components/platform/icons";
import { PlatformShell } from "./components/platform/shell";

/* ------------------------------------------------------------- field helpers */

const text = (label: string): Field => ({ type: "text", label, contentEditable: true });
const textarea = (label: string): Field => ({ type: "textarea", label, contentEditable: true });
const url = (label: string): Field => ({ type: "text", label });
const select = (label: string, options: [string, string][]): Field => ({
  type: "select",
  label,
  options: options.map(([value, l]) => ({ label: l, value })),
});
const span: Field = select("Width in grid", [
  ["1", "1 column"],
  ["2", "2 columns"],
  ["3", "3 columns"],
  ["full", "Full row"],
]);

// Everything placed in a Grid renders without a wrapper and hands its root to
// Puck's drag ref, so the grid lays out the same in the editor as live.
const inline = (c: ComponentConfig<any>): ComponentConfig<any> => ({ inline: true, ...c });
const withPuck =
  (Component: (props: any) => React.ReactNode) =>
  ({ puck, ...props }: any) => <Component {...props} dragRef={puck?.dragRef} isEditing={!!puck?.isEditing} />;

// Blocks that live inside a Grid.
const CARDS = [
  "StatCard",
  "ChartCard",
  "TransactionsTable",
  "BalanceCard",
  "BankAccounts",
  "ActivityFeed",
  "Panel",
  "Notice",
  "FilterBar",
];

/* --------------------------------------------------------------- components */

const components: Record<string, ComponentConfig<any>> = {
  PageHeader: {
    label: "Page header",
    fields: {
      title: text("Title"),
      subtitle: text("Subtitle"),
      actions: { type: "slot", allow: ["PlatformButton"] },
    },
    defaultProps: { title: "Page title", subtitle: "", actions: [] },
    ai: { instructions: "Use once at the top of every dashboard page. Put at most two buttons in actions." },
    render: (props: any) => <PageHeader {...props} />,
  },

  Grid: {
    label: "Grid",
    fields: {
      columns: select("Columns", [
        ["1", "1"],
        ["2", "2"],
        ["3", "3"],
        ["4", "4"],
      ]),
      gap: select("Gap", [
        ["sm", "Compact (12px)"],
        ["md", "Comfortable (16px)"],
      ]),
      items: { type: "slot", allow: CARDS },
    },
    defaultProps: { columns: "3", gap: "sm", items: [] },
    ai: {
      instructions:
        "The layout primitive for dashboards. Stack Grids vertically; use 4 columns for stat rows and 3 columns for chart/table rows, then set each card's span.",
    },
    render: (props: any) => <Grid {...props} />,
  },

  Panel: inline({
    label: "Panel",
    fields: {
      title: text("Title"),
      description: text("Description"),
      span,
      body: { type: "slot", allow: ["DetailList", "PlatformButton", "Notice"] },
    },
    defaultProps: { title: "Panel", description: "", span: "1", body: [] },
    render: withPuck(Panel),
  }),

  StatCard: inline({
    label: "Stat",
    fields: {
      label: text("Label"),
      value: text("Value"),
      delta: text("Change"),
      trend: select("Trend", [
        ["up", "Up (good)"],
        ["down", "Down (bad)"],
        ["flat", "Flat"],
      ]),
      caption: text("Caption"),
      sparkline: { type: "text", label: "Sparkline values (comma separated)" },
      span,
    },
    defaultProps: {
      label: "Gross volume",
      value: "$0.00",
      delta: "+0%",
      trend: "up",
      caption: "vs last week",
      sparkline: "4,6,5,8,7,9,11",
      span: "1",
    },
    ai: { instructions: "Short label, one formatted value. Sparkline is 6-12 comma-separated numbers." },
    render: withPuck(StatCard),
  }),

  ChartCard: inline({
    label: "Chart",
    fields: {
      title: text("Title"),
      value: text("Headline value"),
      caption: text("Caption"),
      kind: select("Chart type", [
        ["area", "Area"],
        ["bar", "Bars"],
      ]),
      data: {
        type: "array",
        label: "Data points",
        arrayFields: { label: { type: "text", label: "Label" }, value: { type: "number", label: "Value" } },
        defaultItemProps: { label: "Mon", value: 10 },
        getItemSummary: (item: { label?: string; value?: number }) => `${item.label ?? ""}: ${item.value ?? 0}`,
      },
      span,
    },
    defaultProps: {
      title: "Payment volume",
      value: "$0.00",
      caption: "Last 7 days",
      kind: "area",
      data: [
        { label: "Mon", value: 12 },
        { label: "Tue", value: 18 },
        { label: "Wed", value: 15 },
        { label: "Thu", value: 22 },
        { label: "Fri", value: 28 },
        { label: "Sat", value: 24 },
        { label: "Sun", value: 30 },
      ],
      span: "2",
    },
    render: withPuck(ChartCard),
  }),

  TransactionsTable: inline({
    label: "Transactions table",
    fields: {
      title: text("Title"),
      linkLabel: text("Link label"),
      linkHref: url("Link"),
      rows: {
        type: "array",
        label: "Rows",
        arrayFields: {
          amount: text("Amount"),
          id: text("Transaction ID"),
          status: select("Status", [
            ["successful", "Successful"],
            ["pending", "Pending"],
            ["failed", "Failed"],
            ["refunded", "Refunded"],
          ]),
          customer: text("Customer"),
          method: text("Paid from"),
          date: text("Date"),
        },
        defaultItemProps: {
          amount: "$25.00",
          id: "TX00000000",
          status: "successful",
          customer: "Customer",
          method: "Chase ••1234",
          date: "Oct 27, 9:41 AM",
        },
        getItemSummary: (item: any) => `${item.amount} · ${item.customer}`,
      },
      span,
    },
    defaultProps: { title: "Recent transactions", linkLabel: "View all", linkHref: "/platform/payments", rows: [], span: "full" },
    render: withPuck(TransactionsTable),
  }),

  FilterBar: inline({
    label: "Filter bar",
    fields: {
      filters: {
        type: "array",
        label: "Filters",
        arrayFields: { label: text("Label") },
        defaultItemProps: { label: "Filter" },
        getItemSummary: (item: any) => item.label || "Filter",
      },
      searchPlaceholder: { type: "text", label: "Search placeholder" },
    },
    defaultProps: { filters: [{ label: "All" }], searchPlaceholder: "Search…" },
    render: withPuck(FilterBar),
  }),

  BalanceCard: inline({
    label: "Balance",
    fields: {
      label: text("Label"),
      amount: text("Amount"),
      account: text("Account"),
      caption: text("Caption"),
      actionLabel: text("Action label"),
      actionHref: url("Action link"),
      tone: select("Style", [
        ["dark", "Dark"],
        ["teal", "Teal"],
        ["mint", "Mint"],
      ]),
      span,
    },
    defaultProps: {
      label: "Available balance",
      amount: "$0.00",
      account: "Checking ••1234",
      caption: "Next payout tomorrow",
      actionLabel: "Pay out now",
      actionHref: "/platform/payouts",
      tone: "dark",
      span: "1",
    },
    render: withPuck(BalanceCard),
  }),

  BankAccounts: inline({
    label: "Bank accounts",
    fields: {
      title: text("Title"),
      accounts: {
        type: "array",
        label: "Accounts",
        arrayFields: {
          bank: text("Bank"),
          mask: text("Last 4"),
          type: text("Type"),
          color: { type: "text", label: "Logo colour" },
          enabled: {
            type: "radio",
            label: "Enabled",
            options: [
              { label: "On", value: true },
              { label: "Off", value: false },
            ],
          },
        },
        defaultItemProps: { bank: "Bank", mask: "1234", type: "Checking", color: "#007881", enabled: true },
        getItemSummary: (item: any) => `${item.bank} ••${item.mask}`,
      },
      span,
    },
    defaultProps: { title: "Payout accounts", accounts: [], span: "1" },
    render: withPuck(BankAccounts),
  }),

  ActivityFeed: inline({
    label: "Activity feed",
    fields: {
      title: text("Title"),
      items: {
        type: "array",
        label: "Events",
        arrayFields: {
          kind: select("Kind", [
            ["payment", "Payment"],
            ["payout", "Payout"],
            ["refund", "Refund"],
            ["customer", "Customer"],
            ["alert", "Alert"],
          ]),
          title: text("Title"),
          meta: text("Detail"),
          time: text("Time"),
        },
        defaultItemProps: { kind: "payment", title: "Payment received", meta: "", time: "Just now" },
        getItemSummary: (item: any) => item.title || "Event",
      },
      span,
    },
    defaultProps: { title: "Activity", items: [], span: "1" },
    render: withPuck(ActivityFeed),
  }),

  Notice: inline({
    label: "Notice",
    fields: {
      tone: select("Tone", [
        ["info", "Info"],
        ["success", "Success"],
        ["warning", "Warning"],
      ]),
      title: text("Title"),
      text: text("Text"),
      linkLabel: text("Link label"),
      linkHref: url("Link"),
    },
    defaultProps: { tone: "info", title: "Heads up.", text: "Something worth knowing.", linkLabel: "", linkHref: "" },
    render: withPuck(Notice),
  }),

  DetailList: inline({
    label: "Detail list",
    fields: {
      items: {
        type: "array",
        label: "Rows",
        arrayFields: { label: text("Label"), value: text("Value") },
        defaultItemProps: { label: "Label", value: "Value" },
        getItemSummary: (item: any) => item.label || "Row",
      },
    },
    defaultProps: { items: [{ label: "Label", value: "Value" }] },
    render: withPuck(DetailList),
  }),

  PlatformButton: inline({
    label: "Button",
    fields: {
      label: text("Label"),
      href: url("Link"),
      variant: select("Style", [
        ["primary", "Primary"],
        ["secondary", "Secondary"],
        ["ghost", "Ghost"],
      ]),
      icon: { type: "select", label: "Icon", options: [{ label: "none", value: "none" }, ...ICON_OPTIONS] },
    },
    defaultProps: { label: "Button", href: "#", variant: "primary", icon: "none" },
    render: withPuck(PlatformButton),
  }),
};

/* ------------------------------------------------------------------ config */

export const platformConfig: Config = {
  categories: {
    layout: { title: "Layout", components: ["PageHeader", "Grid", "Panel"] },
    data: {
      title: "Data",
      components: ["StatCard", "ChartCard", "TransactionsTable", "FilterBar", "BalanceCard", "BankAccounts", "ActivityFeed"],
    },
    content: { title: "Content", components: ["Notice", "DetailList", "PlatformButton"] },
  },
  components,
  root: {
    fields: {
      title: { type: "text", label: "Page title" },
      merchant: { type: "text", label: "Merchant name" },
      user: { type: "text", label: "Signed-in user" },
      environment: {
        type: "radio",
        label: "Environment",
        options: [
          { label: "Live", value: "live" },
          { label: "Sandbox", value: "sandbox" },
        ],
      },
      nav: {
        type: "array",
        label: "Sidebar",
        arrayFields: {
          label: { type: "text", label: "Label" },
          href: { type: "text", label: "Link" },
          icon: { type: "select", label: "Icon", options: ICON_OPTIONS },
        },
        defaultItemProps: { label: "Page", href: "/platform", icon: "home" },
        getItemSummary: (item: any) => item.label || "Link",
      },
    },
    defaultProps: {
      title: "DRUO Dashboard",
      merchant: "Novo Coffee",
      user: "Ana Taylor",
      environment: "live",
      nav: [
        { label: "Overview", href: "/platform", icon: "home" },
        { label: "Payments", href: "/platform/payments", icon: "payments" },
        { label: "Payouts", href: "/platform/payouts", icon: "payouts" },
      ],
    },
    render: ({ children, puck, merchant, user, environment, nav }: any) => (
      <PlatformShell merchant={merchant} user={user} environment={environment} nav={nav} isEditing={!!puck?.isEditing}>
        {children}
      </PlatformShell>
    ),
  },
};

export default platformConfig;
