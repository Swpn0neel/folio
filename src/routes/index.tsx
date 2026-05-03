import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
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
      { title: "Folio" },
      {
        name: "description",
        content:
          "A terminal-flavored portfolio builder for developers. Toggle sections, drag to reorder, get folio.vercel.app/u/yourhandle. Free forever.",
      },
      { property: "og:title", content: "Folio" },
      { property: "og:description", content: "ship a dev portfolio in under 60s. free forever." },
    ],
  }),
  component: Index,
});

function Index() {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && session) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [session, isLoading, navigate]);

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
