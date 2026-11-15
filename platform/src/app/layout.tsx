import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthProvider";
import { ProgressSync } from "@/lib/progress/ProgressSync";
import { SiteFooter } from "@/components/shell/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "LeapCode",
    template: "%s | LeapCode",
  },
  description:
    "Learn to code through structured, interactive courses you work through at your own pace.",
};

/*
 * Content Security Policy.
 *
 * Delivered as a meta tag because GitHub Pages serves plain files and cannot
 * send a header. That carries real limits, and they are worth stating plainly
 * rather than discovering later:
 *
 *   - frame-ancestors is ignored in a meta policy, and Pages will not send
 *     X-Frame-Options either, so this does nothing about clickjacking. That
 *     needs a proxy in front of the origin, not a change in this file.
 *   - There is no report-only mode for a meta policy, so this is enforced the
 *     moment it ships and was tested against the real export instead.
 *   - script-src needs 'unsafe-inline': the export carries seventeen inline
 *     scripts (React's hydration payload plus the theme bootstrap below),
 *     nonces need a server to generate them, and hashes would change on every
 *     build. So this does not stop injected inline script.
 *
 * Which is survivable, because there is nowhere to inject it. The app has
 * exactly two markup sinks, both fed by constants in this repository, and
 * student Python is confined to a worker whose output renders as escaped
 * React children. This policy is not what makes the app safe from injection;
 * it narrows what an injection would be able to reach if one ever appeared,
 * and it stops a remote script from loading at all.
 *
 * 'wasm-unsafe-eval' is for Pyodide, which compiles WebAssembly. It permits
 * WebAssembly compilation and nothing else; full 'unsafe-eval' is not needed
 * and is deliberately absent.
 */
const CSP = [
  "default-src 'self'",
  // apis.google.com is not optional and not obvious: @firebase/auth injects
  // <script src="https://apis.google.com/js/api.js"> into this page to build
  // the sign-in helper iframe. Omitting it blocks that script and Google
  // sign-in stops working, with nothing in the UI to say why.
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://apis.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "worker-src 'self'",
  // Firebase Auth signs in and refreshes tokens; Firestore stores progress.
  // auth.leapcode.org is our own authDomain, which serves the sign-in helper.
  "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://auth.leapcode.org https://apis.google.com",
  // Firebase builds the sign-in helper as an iframe at the auth domain. The
  // Google account chooser itself opens as a popup window, which no policy
  // governs, but accounts.google.com is listed because Google is migrating
  // these flows towards FedCM and framed variants of them.
  "frame-src https://auth.leapcode.org https://accounts.google.com",
  // Nothing on the site submits a form anywhere: sign-in is all JavaScript.
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          First in the head, because a meta policy only governs what is
          parsed after it.

          Production only. Next's dev server rebuilds through eval, which no
          policy worth shipping would allow, and a meta tag cannot be
          report-only. Gating it here keeps `next dev` working while the
          export that students actually load carries the policy.
        */}
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="Content-Security-Policy" content={CSP} />
        )}
        {/*
          The latin slice of each face, which is the only one an English
          page uses. next/font emitted these automatically; now that the
          files are ours, the links are too.

          Without them a font is discovered only once the stylesheet has
          been fetched and parsed, so the first paint lands in the fallback
          face and swaps a moment later. crossOrigin is required even
          though these are same-origin: fonts are always fetched in CORS
          mode, and a preload whose mode does not match the real request is
          thrown away and fetched again.

          Only latin is preloaded. Preloading all seven scripts would make
          every reader pay for six they cannot read.
        */}
        {[
          "inter-latin.woff2",
          "source-serif-4-latin.woff2",
          "jetbrains-mono-latin.woff2",
          "montserrat-latin.woff2",
        ].map((file) => (
          <link
            key={file}
            rel="preload"
            href={`/fonts/${file}`}
            as="font"
            type="font/woff2"
            crossOrigin=""
          />
        ))}
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
        {/*
          Skip link, first in the DOM so it is the first thing focus
          reaches.

          Without it, a keyboard user tabs through the whole header and, on
          most pages, several nav groups before reaching any content, on
          every single page. That is what WCAG means by bypassing blocks.

          It is hidden until focused rather than hidden outright: sr-only
          keeps it off the screen while leaving it in the accessibility
          tree and the tab order, and focus:not-sr-only brings it back into
          view the moment someone tabs to it.
        */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-control focus:bg-accent focus:px-4 focus:py-2.5 focus:font-sans focus:text-sm focus:font-semibold focus:text-ink-inverse"
        >
          Skip to content
        </a>
        <AuthProvider>
          {/* Renders nothing; mirrors progress to the account when signed in. */}
          <ProgressSync />
          {children}
          {/*
            In the layout rather than in each page, so the legal links are
            reachable from every route including ones added later. It sits
            outside the page transition on purpose: the footer is chrome and
            should not slide in behind the content on every navigation.
          */}
          <SiteFooter />
        </AuthProvider>
      </body>
    </html>
  );
}
