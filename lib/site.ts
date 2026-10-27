// Shared links and brand assets. Links point at the live druo.com pages since
// only the home page is cloned. Assets are hotlinked from druo.com.

const EN = "https://druo.com/en";

export const LOGO = "https://druo.com/wp-content/smush-webp/2023/01/Logo-DRUO-Web-Color.png.webp";
export const LOGO_WHITE = "https://druo.com/wp-content/smush-webp/2023/01/Logo-DRUO-Web-White-2x.png.webp";

export const SITE = {
  contact: `${EN}/contact-us/`,
  getStarted: `${EN}/get-started/`,
};

export const NAV = [
  { label: "How it Works", href: `${EN}/how-it-works/` },
  { label: "Pay with DRUO", href: `${EN}/pay-with-druo/` },
  { label: "Why DRUO", href: `${EN}/why-druo/` },
  { label: "For Sellers", href: `${EN}/sellers/` },
];

export const FOOTER_COLUMNS = [
  {
    heading: "For Sellers",
    links: [
      { label: "Overview", href: `${EN}/sellers/` },
      { label: "Why DRUO", href: `${EN}/sellers/why-druo/` },
    ],
  },
  {
    heading: "For Account Holders",
    links: [
      { label: "Overview", href: `${EN}/` },
      { label: "How it works", href: `${EN}/how-it-works/` },
      { label: "Pay with DRUO", href: `${EN}/pay-with-druo/` },
      { label: "Support", href: `${EN}/contact-us/` },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Resources", href: `${EN}/resources/` },
      { label: "Developer Portal", href: "https://developer.druo.com" },
      { label: "Support", href: `${EN}/contact-us/` },
      { label: "Sales", href: `${EN}/contact-us/sales/` },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Contact Us", href: `${EN}/contact-us/` },
      { label: "Legal", href: `${EN}/legal/` },
      { label: "Press & Media", href: `${EN}/newsroom/` },
    ],
  },
];
