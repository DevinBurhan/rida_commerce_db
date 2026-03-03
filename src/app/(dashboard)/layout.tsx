"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MobileDrawer } from "@/components/MobileDrawer";

const SIDEBAR_STORAGE_KEY = "invoice-diary-sidebar-collapsed";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (isReady && !token) {
      router.replace("/login");
    }
  }, [isReady, token, router]);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed));
    } catch {
      // ignore
    }
  }, [sidebarCollapsed]);

  function handleMenuClick() {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed((c) => !c);
    } else {
      setMobileDrawerOpen(true);
    }
  }

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100">
        <p className="text-zinc-500">Loading…</p>
      </div>
    );
  }
  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar collapsed={sidebarCollapsed} />
      <MobileDrawer open={mobileDrawerOpen} onClose={() => setMobileDrawerOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={handleMenuClick} sidebarCollapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
