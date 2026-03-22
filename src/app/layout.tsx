import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GFXLab - Video Game Graphics Comparison Lab",
  description: "Analyze and compare video game graphics quality settings with our precision slider technology. The ultimate graphics comparison platform.",
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
          <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-900/70">
            <div className="container flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 p-[1.5px]">
                  <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="18" rx="1" className="fill-purple-400/30 stroke-purple-400" />
                      <rect x="14" y="3" width="7" height="18" rx="1" className="fill-cyan-400/30 stroke-cyan-400" />
                    </svg>
                  </div>
                </div>
                <span className="text-lg font-bold">
                  <span className="text-white">GFX</span>
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Lab</span>
                </span>
              </Link>

              {/* Navigation */}
              <nav className="flex items-center gap-1">
                <Link
                  href="/"
                  className="px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white hover:bg-gray-800/50 rounded-lg"
                >
                  Home
                </Link>
                <Link
                  href="/games"
                  className="px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white hover:bg-gray-800/50 rounded-lg"
                >
                  Games
                </Link>
                <Link
                  href="/compare/quick"
                  className="px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white hover:bg-gray-800/50 rounded-lg"
                >
                  Quick Compare
                </Link>
                <Link
                  href="/submit"
                  className="px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white hover:bg-gray-800/50 rounded-lg"
                >
                  Submit
                </Link>
                <Link
                  href="/admin"
                  className="ml-2 px-4 py-2 text-sm font-medium text-gray-300 transition-all rounded-lg border border-gray-700 hover:border-purple-500/50 hover:text-white hover:bg-gray-800/50"
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
          <footer className="border-t border-gray-800/50 bg-gray-900/50 backdrop-blur-sm">
            <div className="container py-8">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    <span className="text-white">GFX</span>
                    <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Lab</span>
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-400">
                    Graphics Comparison Lab
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} GFXLab. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
