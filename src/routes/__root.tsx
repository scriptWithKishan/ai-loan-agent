import React from 'react'
import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { Landmark, PhoneCall, History, Shield } from 'lucide-react'
import appCss from '../styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Sunrise Capital — Loan Against Property Advisor' },
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
      <body className="bg-[#edf2f7] text-slate-800 min-h-screen">
        <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500/20">
          {/* Top Navigation */}
          <header className="neu-flat sticky top-0 z-50 border-b border-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              {/* Brand Logo & Name */}
              <Link to="/" className="flex items-center gap-3.5 group">
                <div className="w-11 h-11 rounded-2xl neu-raised flex items-center justify-center text-blue-600 border border-white/80 group-hover:scale-105 transition-transform duration-200">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-base tracking-tight text-slate-800 flex items-center gap-2">
                    Sunrise Capital
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 shadow-sm">
                      Property Loans
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    Loan Against Property Advisory
                  </div>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="flex items-center gap-3 sm:gap-4">
                <Link
                  to="/"
                  className="neu-button flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl text-slate-700 hover:text-blue-600 transition-all [&.active]:neu-inset [&.active]:text-blue-600 [&.active]:border-blue-300"
                >
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  <span>Start Call</span>
                </Link>

                <Link
                  to="/history"
                  className="neu-button flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl text-slate-700 hover:text-blue-600 transition-all [&.active]:neu-inset [&.active]:text-blue-600 [&.active]:border-blue-300"
                >
                  <History className="w-4 h-4 text-blue-600" />
                  <span>Call History</span>
                </Link>

                <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-300/80 text-xs font-semibold text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Verified Banking Portal</span>
                </div>
              </nav>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col">
            <Outlet />
          </main>

          {/* Footer */}
          <footer className="neu-flat border-t border-white/60 py-5 text-center text-xs text-slate-500 font-medium">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                Sunrise Capital Financial Services • Loan Against Property (LAP) Advisory
              </div>
              <div className="text-slate-400 text-[11px]">
                Authorized Property Valuation &amp; Qualification System • All Rights Reserved
              </div>
            </div>
          </footer>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
