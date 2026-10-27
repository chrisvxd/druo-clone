import type { Metadata } from "next";
import "./styles.css";
import "./platform.css";
import { fontVariables } from "../lib/fonts";

// A demo clone: keep it out of search results.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  icons: { icon: "https://druo.com/wp-content/uploads/2023/01/icon-Round-192x192.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
