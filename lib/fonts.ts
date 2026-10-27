import { Plus_Jakarta_Sans } from "next/font/google";

// druo.com sets everything in Plus Jakarta Sans, which is free on Google Fonts.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const fontVariables = jakarta.variable;
