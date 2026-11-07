import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";

// Interface face: neutral, excellent at small sizes.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Lesson prose. A serif makes instruction visually distinct from chrome and
// holds up over long reading sessions.
const readingSerif = Source_Serif_4({
  variable: "--font-reading-serif",
  subsets: ["latin"],
  display: "swap",
});

const monoCode = JetBrains_Mono({
  variable: "--font-mono-code",
  subsets: ["latin"],
  display: "swap",
});

// Reserved for the LEAPCODE wordmark only, carried over from the existing brand.
const brandSans = Montserrat({
  variable: "--font-brand-sans",
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LeapCode",
    template: "%s | LeapCode",
  },
  description:
    "Learn to code through structured, interactive courses you work through at your own pace.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // The font variables must live on <html>, not <body>. Tailwind emits its
  // own --font-* tokens on :root, and those reference these variables. If they
  // were only defined on <body>, the :root declarations would resolve against
  // an undefined variable, become invalid at computed-value time, and silently
  // fall back to the default sans stack.
  return (
    <html
      lang="en"
      className={`${inter.variable} ${readingSerif.variable} ${monoCode.variable} ${brandSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
