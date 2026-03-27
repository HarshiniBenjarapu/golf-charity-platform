"use client";

import { Menu, Bell, Search, User } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  setSidebarOpen: (isOpen: boolean) => void;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-20 px-6 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50">
      
      {/* Mobile Menu Toggle & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-zinc-400 hover:text-white transition-colors lg:hidden rounded-lg hover:bg-zinc-800/50"
        >
          <Menu size={24} />
        </button>
        <div className="hidden lg:block">
          <h1 className="text-xl font-semibold tracking-wide text-zinc-100">
            Welcome back
          </h1>
          <p className="text-sm tracking-wide text-zinc-500">
            Here&apos;s what&apos;s happening today.
          </p>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Search */}
        <div className="relative hidden sm:block group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500 group-focus-within:text-violet-400 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="block w-64 p-2.5 pl-10 text-sm bg-zinc-900 border border-zinc-800 rounded-xl focus:ring-1 focus:ring-violet-500 focus:border-violet-500 text-white placeholder-zinc-500 transition-all shadow-inner"
            placeholder="Search..."
          />
        </div>

        <button className="sm:hidden p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800/50">
          <Search size={20} />
        </button>

        {/* Separator */}
        <div className="hidden sm:block w-px h-6 bg-zinc-800" />

        {/* Notifications */}
        <Link href="/notifications" className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800/50 group">
          <Bell size={20} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
        </Link>

        {/* Profile Dropdown Trigger */}
        <Link href="/profile" className="flex items-center gap-3 p-1 rounded-full border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/20 transition-all group">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 group-hover:bg-violet-500/10 transition-colors">
            <User size={16} className="text-zinc-400 group-hover:text-violet-400 transition-colors" />
          </div>
        </Link>
      </div>

    </header>
  );
}
