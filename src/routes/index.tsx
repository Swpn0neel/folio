import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { PortfolioPreview } from "@/components/landing/PortfolioPreview";
import { SectionsShowcase } from "@/components/landing/SectionsShowcase";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "folio — brutalist portfolios for engineers" },
      {
        name: "description",
        content:
          "A terminal-flavored portfolio builder for developers. Toggle sections, drag to reorder, get folio.dev/u/yourhandle. Free forever.",
      },
      { property: "og:title", content: "folio — brutalist portfolios for engineers" },
      { property: "og:description", content: "ship a dev portfolio in under 60s. free forever." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <PortfolioPreview />
        <SectionsShowcase />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
