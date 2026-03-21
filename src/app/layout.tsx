import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Before/After - Video Game Graphics Comparison",
  description: "Compare video game graphics quality settings side-by-side with an interactive slider interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-gray-900 text-white min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
            <div className="container flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                  Before/After
                </span>
              </Link>

              {/* Navigation */}
              <nav className="flex items-center space-x-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Home
                </Link>
                <Link
                  href="/games"
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Games
                </Link>
                <Link
                  href="/compare/quick"
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Quick Compare
                </Link>
                <Link
                  href="/submit"
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Submit
                </Link>
                <Link
                  href="/admin"
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-accent-primary"
                >
                  Admin
                </Link>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            <div className="container py-6">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-800 py-6">
            <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Before/After. All rights reserved.
              </p>
              <p className="text-sm text-gray-500">
                Video Game Graphics Comparison Tool
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
