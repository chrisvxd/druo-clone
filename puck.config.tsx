import type { ComponentConfig, Config, Field } from "@puckeditor/core";
import {
  BusinessCard,
  Button,
  Checkout,
  CtaStrip,
  DarkFeatures,
  Faq,
  FaqItem,
  FeatureCard,
  FeatureRow,
  Hero,
  SplitBand,
} from "./components/blocks/home";
import { SiteShell } from "./components/site/shell";

/* ------------------------------------------------------------- field helpers */

// Every visible string is editable in place on the canvas. Links and image
// URLs stay in the sidebar.
const text = (label: string): Field => ({ type: "text", label, contentEditable: true });
const textarea = (label: string): Field => ({ type: "textarea", label, contentEditable: true });
const richtext = (label: string): Field => ({ type: "richtext", label, contentEditable: true });
const url = (label: string): Field => ({ type: "text", label });
const image = (label = "Image URL"): Field => ({ type: "text", label });
const slot = (allow: string[]): Field => ({ type: "slot", allow });

// Cards and buttons render without a wrapper and hand their root to Puck's
// drag ref, so slot grids lay out the same in the editor as on the site.
const inline = (c: ComponentConfig<any>): ComponentConfig<any> => ({ inline: true, ...c });
const dragProps = (puck: { dragRef?: unknown; isEditing?: boolean } | undefined) => ({
  dragRef: puck?.dragRef as any,
  isEditing: !!puck?.isEditing,
});

const actions = slot(["Button"]);

/* --------------------------------------------------------------- components */

const components: Record<string, ComponentConfig<any>> = {
  Hero: {
    label: "Hero",
    fields: {
      title: textarea("Headline"),
      lead: textarea("Intro"),
      actions,
      note: text("Small print"),
      faces: {
        type: "array",
        label: "Customer photos",
        arrayFields: { image: image("Photo URL") },
        defaultItemProps: { image: "" },
        getItemSummary: (_: unknown, i?: number) => `Photo ${(i ?? 0) + 1}`,
      },
      trust: text("Trust line"),
      image: image("Image URL"),
      imageAlt: url("Image alt text"),
    },
    defaultProps: {
      title: "Pay businesses straight from your bank",
      lead: "One tap, no card numbers, no extra wallets.",
      actions: [],
      note: "Free to start.",
      faces: [],
      trust: "Trusted by 1.5M+ users",
      image: "",
      imageAlt: "",
    },
    render: (props: any) => <Hero {...props} />,
  },

  FeatureRow: {
    label: "Feature row (3 cards)",
    fields: { title: text("Heading"), lead: textarea("Intro"), cards: slot(["FeatureCard"]) },
    defaultProps: { title: "Section heading", lead: "", cards: [] },
    render: (props: any) => <FeatureRow {...props} />,
  },

  DarkFeatures: {
    label: "Dark feature grid (2 columns)",
    fields: { title: text("Heading"), lead: textarea("Intro"), cards: slot(["FeatureCard"]) },
    defaultProps: { title: "Section heading", lead: "", cards: [] },
    render: (props: any) => <DarkFeatures {...props} />,
  },

  FeatureCard: inline({
    label: "Feature card",
    fields: {
      image: image(),
      imageAlt: url("Image alt text"),
      title: text("Title"),
      text: textarea("Text"),
    },
    defaultProps: {
      image: "https://druo.com/wp-content/smush-webp/2025/01/Select-Bank.png.webp",
      imageAlt: "",
      title: "Feature title",
      text: "A short line about this feature.",
    },
    render: ({ puck, ...props }: any) => <FeatureCard {...props} {...dragProps(puck)} />,
  }),

  Checkout: {
    label: "Checkout showcase",
    fields: {
      title: text("Heading"),
      lead: textarea("Intro"),
      actions,
      image: image("Left image URL"),
      imageAlt: url("Left image alt text"),
      sideImage: image("Right image URL"),
      sideImageAlt: url("Right image alt text"),
    },
    defaultProps: {
      title: "Section heading",
      lead: "",
      actions: [],
      image: "",
      imageAlt: "",
      sideImage: "",
      sideImageAlt: "",
    },
    render: (props: any) => <Checkout {...props} />,
  },

  SplitBand: {
    label: "Image and text band",
    fields: {
      image: image(),
      imageAlt: url("Image alt text"),
      title: textarea("Heading"),
      text: richtext("Text"),
      actions,
    },
    defaultProps: { image: "", imageAlt: "", title: "Section heading", text: "<p>Body copy.</p>", actions: [] },
    render: (props: any) => <SplitBand {...props} />,
  },

  CtaStrip: {
    label: "Call to action",
    fields: { title: textarea("Heading"), actions },
    defaultProps: { title: "Ready to get started?", actions: [] },
    render: (props: any) => <CtaStrip {...props} />,
  },

  BusinessCard: {
    label: "Business card",
    fields: {
      eyebrow: text("Eyebrow"),
      title: textarea("Heading"),
      text: richtext("Text"),
      actions,
      image: image(),
      imageAlt: url("Image alt text"),
    },
    defaultProps: {
      eyebrow: "DRUO for businesses",
      title: "Section heading",
      text: "<p>Body copy.</p>",
      actions: [],
      image: "",
      imageAlt: "",
    },
    render: (props: any) => <BusinessCard {...props} />,
  },

  Faq: {
    label: "FAQ",
    fields: { title: text("Heading"), items: slot(["FaqItem"]) },
    defaultProps: { title: "Frequently Asked Questions (FAQ)", items: [] },
    render: (props: any) => <Faq {...props} />,
  },

  FaqItem: inline({
    label: "FAQ item",
    fields: { question: textarea("Question"), answer: richtext("Answer") },
    defaultProps: { question: "A common question?", answer: "<p>A short answer.</p>" },
    render: ({ puck, ...props }: any) => <FaqItem {...props} {...dragProps(puck)} />,
  }),

  Button: inline({
    label: "Button",
    fields: {
      label: text("Label"),
      href: url("Link"),
      variant: {
        type: "select",
        label: "Style",
        options: [
          { label: "Teal", value: "primary" },
          { label: "White", value: "white" },
          { label: "Sand", value: "sand" },
        ],
      },
      wide: {
        type: "radio",
        label: "Extra padding",
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    },
    defaultProps: { label: "Get Started", href: "https://druo.com/en/get-started/", variant: "primary", wide: false },
    render: ({ puck, ...props }: any) => <Button {...props} dragRef={puck?.dragRef} />,
  }),
};

/* ------------------------------------------------------------------ config */

export const config: Config = {
  categories: {
    sections: {
      title: "Sections",
      components: ["Hero", "FeatureRow", "Checkout", "SplitBand", "DarkFeatures", "CtaStrip", "BusinessCard", "Faq"],
    },
    items: { title: "Items", components: ["FeatureCard", "FaqItem", "Button"] },
  },
  components,
  root: {
    fields: {
      title: { type: "text", label: "Page title" },
    },
    defaultProps: { title: "" },
    render: ({ children, puck }: any) => <SiteShell isEditing={!!puck?.isEditing}>{children}</SiteShell>,
  },
};

export default config;
