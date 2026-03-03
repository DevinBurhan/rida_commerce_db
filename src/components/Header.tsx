"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuIcon, UserIcon } from "./icons";

type HeaderProps = {
  onMenuClick: () => void;
  sidebarCollapsed?: boolean;
};

export function Header({ onMenuClick, sidebarCollapsed }: HeaderProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSignOut() {
    setUserOpen(false);
    logout();
    router.replace("/login");
  }

  return (
    <header
      className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-zinc-200 bg-white px-4 shadow-sm"
      style={{ height: "var(--header-height, 4rem)" }}
    >
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-lg text-zinc-600 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Toggle menu"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
        <span className="text-lg font-semibold text-zinc-900">Invoice Diary</span>
      </Link>

  

      <div className="relative ml-auto flex items-center" ref={userRef}>
        <button
          type="button"
          onClick={() => setUserOpen((o) => !o)}
          className="flex h-10 w-10 min-w-[2.5rem] items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-expanded={userOpen}
          aria-haspopup="true"
          aria-label="User menu"
        >
          <UserIcon className="h-5 w-5" />
        </button>
        {userOpen && (
          <div className="absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border border-zinc-200 bg-white py-1 shadow-md">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
