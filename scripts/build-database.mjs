// Seeds database.json with the druo.com/en home page clone. Layout, links,
// imagery and facts follow the live site. All copy is written fresh for the demo.
//
//   node scripts/build-database.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const EN = "https://druo.com/en";
const WEBP = "https://druo.com/wp-content/smush-webp";
const UP = "https://druo.com/wp-content/uploads";

let n = 0;
const block = (type, props) => ({ type, props: { id: `${type}-${++n}`, ...props } });
const html = (...paragraphs) => paragraphs.map((p) => `<p>${p}</p>`).join("");
const button = (label, href, variant = "primary", wide = false) => block("Button", { label, href, variant, wide });
const getStarted = (wide) => button("Get Started", `${EN}/get-started/`, "primary", wide);

const home = {
  root: { props: { title: "DRUO clone" } },
  content: [
    block("Hero", {
      title: "Pay any business right from your bank account",
      lead: "Check out in seconds wherever you shop. You don't need a card or a new app.",
      actions: [getStarted(), button("How it Works", `${EN}/how-it-works/`, "white")],
      note: "Free to join. All you need is a bank account.",
      faces: [
        { image: `${WEBP}/2023/07/Screen-Shot-2022-08-20-at-1.31.35-PM-140x140.png.webp` },
        { image: `${WEBP}/2022/08/group-hotel-staffs-standing-kitchen-comp-1-140x140.jpg.webp` },
        { image: `${WEBP}/2022/08/Modern-Business-User-140x140.jpg.webp` },
      ],
      trust: "Trusted by 1.5M+ users",
      image: `${UP}/2026/10/Group-4932-1.png`,
      imageAlt: "Two friends paying from a phone, with a successful DRUO direct debit order",
    }),

    block("FeatureRow", {
      title: "A smarter way to pay",
      lead: "Send money to the merchants you love straight from your bank. It's more secure, it's quicker and there are no fees.",
      cards: [
        block("FeatureCard", {
          image: `${WEBP}/2025/01/Select-Bank.png.webp`,
          imageAlt: "Bank picker showing featured banks",
          title: "Pay with your bank",
          text: "Choose your bank and pay. You won't need a card or a separate wallet app.",
        }),
        block("FeatureCard", {
          image: `${WEBP}/2025/01/DRUO-Token-Security.png.webp`,
          imageAlt: "Tokenized DRUO payment card",
          title: "Protected by design",
          text: "Modern fraud protection makes paying with DRUO 50x safer than paying with a card.",
        }),
        block("FeatureCard", {
          image: `${WEBP}/2025/01/Credit-Score.png.webp`,
          imageAlt: "Credit score meter",
          title: "Grow your credit",
          text: "Each DRUO payment counts toward your credit score, so paying on time pays off.",
        }),
      ],
    }),

    block("Checkout", {
      title: "Find us at checkout",
      lead: "Shop online or at the counter, and DRUO pays straight from your bank account.",
      actions: [getStarted(), button("How to Pay", `${EN}/pay-with-druo/`, "sand")],
      image: `${UP}/2026/10/DRUO-Checkout-Mobile.png`,
      imageAlt: "Online checkout with DRUO direct debit selected",
      sideImage: `${WEBP}/2025/01/DRUO-In-Store-Checkout-Pay-By-Bank.png.webp`,
      sideImageAlt: "In-store tap to pay and a successful autopay",
    }),

    block("SplitBand", {
      image: `${UP}/2026/10/DRUO-Autopay.png`,
      imageAlt: "DRUO subscription set to autopay from savings",
      title: "Pay the brands you love in seconds, or set it and forget it",
      text: html(
        "Use DRUO for bills, memberships and everything in between, either one payment at a time or on a schedule. Link your bank once and the next payment goes out on its own.",
      ),
      actions: [getStarted(), button("How it Works", `${EN}/how-it-works/`)],
    }),

    block("DarkFeatures", {
      title: "Pay on your terms, fast and safe.",
      lead: "Choose how and where you pay, and get an alert for every payment. You get more control than with any other way to pay.",
      cards: [
        block("FeatureCard", {
          image: `${WEBP}/2025/01/DRUO-Verified-Merchants-1.png.webp`,
          imageAlt: "Verified merchant badge",
          title: "Verified merchants",
          text: "Every merchant is vetted before joining, so scammers stay out.",
        }),
        block("FeatureCard", {
          image: `${WEBP}/2025/01/Control.png.webp`,
          imageAlt: "Account toggles per bank",
          title: "Fine-grained controls",
          text: "Pick your settings once, or set them for each merchant.",
        }),
        block("FeatureCard", {
          image: `${WEBP}/2025/01/DRUO-Transaction-Notification-2.png.webp`,
          imageAlt: "Payment notification on a phone lock screen",
          title: "Instant alerts",
          text: "Get notified the moment any payment goes through.",
        }),
        block("FeatureCard", {
          image: `${WEBP}/2025/01/Support.png.webp`,
          imageAlt: "Two DRUO support team members",
          title: "Help from DRUO",
          text: "Reach the DRUO team directly whenever you need help.",
        }),
      ],
    }),

    block("CtaStrip", {
      title: "Start paying from your bank account today",
      actions: [button("Connect Account", `${EN}/get-started/`, "primary", true)],
    }),

    block("BusinessCard", {
      eyebrow: "DRUO for businesses",
      title: "Grow your business with DRUO",
      text: html("Take payments straight from your customers' bank accounts to keep more of every sale and keep buyers happy."),
      actions: [getStarted(true)],
      image: `${WEBP}/2025/01/Product-Suite-Image.png.webp`,
      imageAlt: "DRUO dashboard with integrations",
    }),

    block("Faq", {
      title: "Frequently Asked Questions (FAQ)",
      items: [
        block("FaqItem", {
          question: "What is DRUO?",
          answer: html("DRUO lets you pay businesses directly from your bank account, so you don't need a card or a payment app."),
        }),
        block("FaqItem", {
          question: "Can my business accept payments with DRUO?",
          answer: html(`Yes. See <a href="${EN}/sellers/">DRUO for Business</a> to learn how.`),
        }),
        block("FaqItem", {
          question: "Is my bank account safe with DRUO?",
          answer: html(
            "Yes. DRUO protects your account with encryption, step-by-step verification and around-the-clock monitoring for unusual activity.",
          ),
        }),
        block("FaqItem", {
          question: "Does it cost anything to pay with DRUO?",
          answer: html("No. Paying with DRUO is free, and you won't pay the fees that come with cards."),
        }),
        block("FaqItem", {
          question: "Can I pay merchants in other countries?",
          answer: html("Yes, as long as your bank is in the DRUO network."),
        }),
        block("FaqItem", {
          question: "How do I change or cancel a recurring payment?",
          answer: html(
            `Contact the merchant you set the payment up with first. If you still need help, <a href="${EN}/contact-us/">get in touch with DRUO</a>.`,
          ),
        }),
      ],
    }),
  ],
};

/* ------------------------------------------------- platform (dashboard example) */

// Fictional merchant data for the platform.config.tsx example pages.
const platformRoot = (title) => ({
  root: {
    props: {
      title,
      merchant: "Novo Coffee",
      user: "Ana Taylor",
      environment: "live",
      nav: [
        { label: "Overview", href: "/platform", icon: "home" },
        { label: "Payments", href: "/platform/payments", icon: "payments" },
        { label: "Payouts", href: "/platform/payouts", icon: "payouts" },
        { label: "Developers", href: "https://developer.druo.com", icon: "developers" },
      ],
    },
  },
});
const btn = (label, href, variant = "primary", icon = "none") => block("PlatformButton", { label, href, variant, icon });
const grid = (columns, items) => block("Grid", { columns: String(columns), gap: "sm", items });
const stat = (label, value, delta, trend, caption, sparkline) =>
  block("StatCard", { label, value, delta, trend, caption, sparkline, span: "1" });

const tx = (amount, id, status, customer, method, date) => ({ amount, id, status, customer, method, date });
const TRANSACTIONS = [
  tx("$150.00", "TX38GQ3ADFK", "successful", "John Smith", "Chase ••8719", "Oct 27, 9:41 AM"),
  tx("$75.00", "TCN8F3I8HFAW", "successful", "Michael Connelly", "Bank of America ••2214", "Oct 27, 9:12 AM"),
  tx("$6,732.45", "T8NCASWEF92", "pending", "Anton Polk", "Wells Fargo ••0766", "Oct 27, 8:58 AM"),
  tx("$17,550.00", "TM7CN3ENC8D", "successful", "Harbor Supply Co.", "Santander ••1234", "Oct 26, 6:20 PM"),
  tx("$4.00", "T8EFAEW0QF3", "successful", "Courier", "Santander ••1234", "Oct 26, 4:03 PM"),
  tx("$32.80", "TVN8ECEASBE", "failed", "Priya Natarajan", "Capital One ••5530", "Oct 26, 1:47 PM"),
  tx("$58.25", "TQ2LM8ZK1RA", "successful", "Lena Ortiz", "PNC ••4471", "Oct 26, 11:05 AM"),
  tx("$19.90", "TB7HX0PL3WD", "refunded", "Marcus Lee", "TD Bank ••9902", "Oct 25, 5:31 PM"),
  tx("$240.00", "TR5KD2NV8QE", "successful", "Fernwood Café", "US Bank ••3318", "Oct 25, 2:16 PM"),
  tx("$12.50", "TJ9WE4CM6TS", "pending", "Sofia Reyes", "BBVA ••6025", "Oct 25, 9:48 AM"),
];

const days = ["Oct 14", "Oct 15", "Oct 16", "Oct 17", "Oct 18", "Oct 19", "Oct 20", "Oct 21", "Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26", "Oct 27"];
const volume = [2.8, 3.1, 2.6, 3.4, 4.2, 3.9, 3.0, 3.3, 3.8, 3.6, 4.4, 4.9, 4.1, 5.2];

const platformOverview = {
  ...platformRoot("Overview · DRUO Dashboard"),
  content: [
    block("PageHeader", {
      title: "Good morning, Ana",
      subtitle: "Here's how Novo Coffee is doing today.",
      actions: [btn("Export", "#", "secondary", "download"), btn("Create payment link", "#", "primary", "plus")],
    }),
    grid(4, [
      stat("Gross volume", "$48,210.55", "+12.4%", "up", "vs last week", "28,31,26,34,42,39,30,33,38,36,44,49,41,52"),
      stat("Successful payments", "1,284", "+8.1%", "up", "vs last week", "80,84,79,90,96,94,88,91,97,95,102,108,104,112"),
      stat("Average ticket", "$37.55", "−2.3%", "down", "vs last week", "40,39,41,38,39,37,38,37,36,38,37,36,37,37"),
      stat("Dispute rate", "0.04%", "0.00%", "flat", "No change", "4,4,5,4,4,4,4,4,5,4,4,4,4,4"),
    ]),
    grid(3, [
      block("ChartCard", {
        title: "Payment volume",
        value: "$52,418.20",
        caption: "Last 14 days",
        kind: "area",
        data: days.map((label, i) => ({ label, value: volume[i] * 1000 })),
        span: "2",
      }),
      block("BalanceCard", {
        label: "Available balance",
        amount: "$12,480.20",
        account: "Santander ••1234",
        caption: "Next payout Oct 29",
        actionLabel: "Pay out now",
        actionHref: "/platform/payouts",
        tone: "dark",
        span: "1",
      }),
    ]),
    grid(3, [
      block("TransactionsTable", {
        title: "Recent transactions",
        linkLabel: "View all",
        linkHref: "/platform/payments",
        rows: TRANSACTIONS.slice(0, 6),
        span: "2",
      }),
      block("ActivityFeed", {
        title: "Activity",
        span: "1",
        items: [
          { kind: "payment", title: "$17,550.00 received", meta: "Harbor Supply Co. · invoice #1042", time: "2h" },
          { kind: "payout", title: "Payout sent", meta: "$9,812.40 to Santander ••1234", time: "5h" },
          { kind: "customer", title: "New autopay customer", meta: "Lena Ortiz connected PNC ••4471", time: "8h" },
          { kind: "refund", title: "Refund issued", meta: "$19.90 to Marcus Lee", time: "1d" },
          { kind: "alert", title: "Payment failed", meta: "Insufficient funds · Priya Natarajan", time: "1d" },
        ],
      }),
    ]),
  ],
};

const platformPayments = {
  ...platformRoot("Payments · DRUO Dashboard"),
  content: [
    block("PageHeader", {
      title: "Payments",
      subtitle: "Every pay-by-bank payment from checkout, invoices and autopay.",
      actions: [btn("Export CSV", "#", "secondary", "download"), btn("New payment", "#", "primary", "plus")],
    }),
    grid(4, [
      stat("Collected this week", "$21,904.10", "+9.6%", "up", "312 payments", "12,14,13,16,18,17,21"),
      stat("Pending", "$6,745.95", "", "flat", "2 payments · clear in ~1 business day", "3,5,4,6,5,7,6"),
      stat("Failed", "$32.80", "−40%", "up", "1 payment this week", "5,4,4,3,2,2,1"),
      stat("Refunded", "$19.90", "", "flat", "1 refund · 0.09% of volume", "1,0,1,0,0,1,1"),
    ]),
    grid(1, [
      block("FilterBar", {
        filters: [{ label: "All" }, { label: "Successful" }, { label: "Pending" }, { label: "Failed" }, { label: "Refunded" }],
        searchPlaceholder: "Search by customer, amount or ID…",
      }),
      block("TransactionsTable", { title: "All payments", linkLabel: "", linkHref: "", rows: TRANSACTIONS, span: "full" }),
    ]),
  ],
};

const platformPayouts = {
  ...platformRoot("Payouts · DRUO Dashboard"),
  content: [
    block("PageHeader", {
      title: "Payouts",
      subtitle: "Move your DRUO balance to your business bank accounts.",
      actions: [btn("Payout settings", "#", "secondary", "settings"), btn("Pay out now", "#", "primary", "payouts")],
    }),
    grid(1, [
      block("Notice", {
        tone: "info",
        title: "Next-day payouts are on.",
        text: "Balances available by 5 PM ET land in your account the next business day.",
        linkLabel: "Learn more",
        linkHref: "https://druo.com/en/contact-us/",
      }),
    ]),
    grid(3, [
      block("BalanceCard", {
        label: "Available to pay out",
        amount: "$12,480.20",
        account: "Santander ••1234",
        caption: "Scheduled for Oct 29",
        actionLabel: "Pay out now",
        actionHref: "#",
        tone: "teal",
        span: "1",
      }),
      block("BalanceCard", {
        label: "In transit",
        amount: "$9,812.40",
        account: "Santander ••1234",
        caption: "Arrives Oct 28",
        actionLabel: "",
        actionHref: "",
        tone: "mint",
        span: "1",
      }),
      block("BankAccounts", {
        title: "Payout accounts",
        span: "1",
        accounts: [
          { bank: "Santander", mask: "1234", type: "Business checking · default", color: "#ec0000", enabled: true },
          { bank: "Chase", mask: "8719", type: "Business savings", color: "#117aca", enabled: false },
        ],
      }),
    ]),
    grid(3, [
      block("ChartCard", {
        title: "Payouts by week",
        value: "$61,207.85",
        caption: "Last 8 weeks",
        kind: "bar",
        data: [
          { label: "Sep 1", value: 6120 },
          { label: "Sep 8", value: 7045 },
          { label: "Sep 15", value: 6890 },
          { label: "Sep 22", value: 7480 },
          { label: "Sep 29", value: 8010 },
          { label: "Oct 6", value: 7655 },
          { label: "Oct 13", value: 8540 },
          { label: "Oct 20", value: 9467 },
        ],
        span: "2",
      }),
      block("Panel", {
        title: "Payout schedule",
        description: "Applies to all payout accounts.",
        span: "1",
        body: [
          block("DetailList", {
            items: [
              { label: "Frequency", value: "Daily" },
              { label: "Cut-off", value: "5:00 PM ET" },
              { label: "Arrival", value: "Next business day" },
              { label: "Minimum payout", value: "$25.00" },
              { label: "Fees", value: "$0.00" },
            ],
          }),
          btn("Edit schedule", "#", "secondary", "settings"),
        ],
      }),
    ]),
  ],
};

fs.writeFileSync(
  path.join(root, "database.json"),
  JSON.stringify(
    {
      "/": home,
      "/platform": platformOverview,
      "/platform/payments": platformPayments,
      "/platform/payouts": platformPayouts,
    },
    null,
    2,
  ),
);
console.log("Wrote database.json");
