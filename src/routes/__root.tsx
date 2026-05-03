import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/components/auth/AuthProvider";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Folio — Beautiful portfolios for developers" },
      { name: "description", content: "Build a stunning developer portfolio in minutes. Showcase your projects, blogs, and experience on your own folio.vercel.app/u/handle." },
      { name: "author", content: "Folio" },
      { property: "og:title", content: "Folio — Beautiful portfolios for developers" },
      { property: "og:description", content: "Build a stunning developer portfolio in minutes. Drag, drop, ship." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMicgZmlsbD0nbm9uZSc+PHJlY3QgeD0nMicgeT0nMicgd2lkdGg9JzI4JyBoZWlnaHQ9JzI4JyBzdHJva2U9J3doaXRlJyBzdHJva2Utd2lkdGg9JzIuNScvPjxwYXRoIGQ9J00xMiAyMlYxMEgyME0xMiAxNkgxOCcgc3Ryb2tlPSd3aGl0ZScgc3Ryb2tlLXdpZHRoPScyLjUnIHN0cm9rZS1saW5lY2FwPSdzcXVhcmUnLz48cmVjdCB4PScyMCcgeT0nMjAnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnIGZpbGw9JyNhM2U2MzUnLz48L3N2Zz4=" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
