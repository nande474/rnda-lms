"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { Megaphone, X } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  message: string;
}

interface DashboardShellProps {
  role: string;
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: string;
    grade: number | null;
    siteId: number | null;
  };
  announcements?: Announcement[];
  children: React.ReactNode;
}

export function DashboardShell({ role, user, announcements = [], children }: DashboardShellProps) {
  const [sidebarOpen,       setSidebarOpen]       = useState(false);
  const [dismissedIds,      setDismissedIds]      = useState<Set<string>>(new Set());
  const pathname = usePathname();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("rnda_dismissed_announcements") ?? "[]");
      setDismissedIds(new Set(stored));
    } catch { /* ignore */ }
  }, []);

  const dismiss = (id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      try { localStorage.setItem("rnda_dismissed_announcements", JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  const visible = announcements.filter((a) => !dismissedIds.has(a.id));

  // Close sidebar on route change (mobile nav)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Close sidebar on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg,#f5faf4 0%,#f0f7eb 100%)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Topbar user={user} onMenuToggle={() => setSidebarOpen((v) => !v)} />

      <main className="lg:ml-64 pt-16 min-h-screen">
        {visible.length > 0 && (
          <div className="px-4 sm:px-6 pt-4 space-y-2">
            {visible.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
              >
                <Megaphone size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-amber-800">{a.title}</p>
                  <p className="text-sm text-amber-700">{a.message}</p>
                </div>
                <button
                  onClick={() => dismiss(a.id)}
                  className="shrink-0 text-amber-400 hover:text-amber-700 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="p-4 sm:p-6">{children}</div>
        <footer className="mt-auto px-4 sm:px-6 py-4 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} Regenerating Neighbourhood Development Agency</span>
          <Link href="/privacy-policy" className="hover:text-gray-600 transition-colors">
            Privacy Policy
          </Link>
        </footer>
      </main>
    </div>
  );
}
