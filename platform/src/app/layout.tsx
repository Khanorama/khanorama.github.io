import type { Metadata } from "next";
import { Inter, Source_Serif_4, JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ProgressSync } from "@/lib/progress/ProgressSync";

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
      suppressHydrationWarning
    >
      <head>
        {/*
          Two things, both of which have to happen before the first paint.

          The theme, because a static export has no server to read the
          preference and the page would otherwise render light and snap to
          dark on hydration.

          The js class, because the scroll reveals hide their targets and
          only script can ever bring them back. Scoping that hidden state to
          this class means a reader with JavaScript blocked or broken gets a
          fully visible page instead of a mostly empty one. It is set here
          rather than in React so the hidden state is already in force on
          the first frame, which is what keeps content from flashing in and
          then back out again.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var e=document.documentElement;try{var c=localStorage.getItem('leapcode-theme');var d=c?c==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)e.classList.add('dark');}catch(x){}e.classList.add('js');})();`,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          {/* Renders nothing; mirrors progress to the account when signed in. */}
          <ProgressSync />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
