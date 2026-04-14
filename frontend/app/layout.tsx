import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpportuNest - Student Opportunity Portal",
  description:
    "Discover internships, hackathons, scholarships, and opportunities tailored for you with AI-powered recommendations.",
  keywords: ["internship", "hackathon", "scholarship", "opportunity", "student"],
  authors: [{ name: "OpportuNest Team" }],
  openGraph: {
    title: "OpportuNest",
    description: "Your ultimate student opportunity portal",
    type: "website",
    url: "http://localhost:3000",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <div className="flex min-h-screen flex-col">
          {/* Navigation placeholder */}
          <nav className="border-b border-border bg-card">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">🏠 OpportuNest</h1>
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Footer placeholder */}
          <footer className="border-t border-border bg-card text-center py-6">
            <p className="text-sm text-muted-foreground">
              © 2026 OpportuNest. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
