import React from 'react'
import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { Landmark, Phone, History, ShieldCheck } from 'lucide-react'
import appCss from '../styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Loan Against Property (LAP) — AI Voice Advisor' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#090d16] text-slate-100 min-h-screen">
        <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-500/30">
          {/* Top Navigation */}
          <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
                    Sunrise Capital
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      LAP AI
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Loan Against Property • Voice Qualification
                  </div>
                </div>
              </Link>

              <nav className="flex items-center gap-2 sm:gap-4">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all [&.active]:bg-indigo-600/10 [&.active]:text-indigo-400 [&.active]:border [&.active]:border-indigo-500/30"
                >
                  <Phone className="w-4 h-4" />
                  <span>Start Call</span>
                </Link>

                <Link
                  to="/history"
                  className="flex items-center gap-2 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all [&.active]:bg-indigo-600/10 [&.active]:text-indigo-400 [&.active]:border [&.active]:border-indigo-500/30"
                >
                  <History className="w-4 h-4" />
                  <span>Call History</span>
                </Link>

                <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-800 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Production Vercel Ready</span>
                </div>
              </nav>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>

          <footer className="border-t border-slate-800/60 py-4 bg-slate-950/40 text-center text-xs text-slate-500">
            Loan Against Property AI Advisor • Powered by Retell AI, Google Gemini &amp; Neon PostgreSQL
          </footer>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
