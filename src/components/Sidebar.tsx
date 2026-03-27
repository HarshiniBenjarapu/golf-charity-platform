"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Trophy, 
  HeartHandshake, 
  Ticket,
  Shield,
  LogOut,
  X
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Scores", href: "/scores", icon: Trophy },
  { name: "Charity", href: "/charity", icon: HeartHandshake },
  { name: "Draws", href: "/draws", icon: Ticket },
  { name: "Admin", href: "/admin", icon: Shield },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-zinc-950 border-r border-zinc-800/50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header / Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-zinc-800/50">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
              <span className="text-lg font-bold text-white tracking-widest">GC</span>
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent group-hover:to-zinc-200 transition-all">
              Elevate
            </span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-zinc-400 hover:text-white lg:hidden transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? "text-white" 
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {/* Active Indicator Background */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent border-l-2 border-violet-500" />
                )}
                
                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-zinc-800 to-transparent transition-opacity" />

                <Icon 
                  size={20} 
                  className={`relative z-10 transition-transform duration-300 ${
                    isActive ? "text-violet-400" : "group-hover:scale-110"
                  }`} 
                />
                <span className="relative z-10 font-medium tracking-wide">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / User Actions */}
        <div className="p-4 border-t border-zinc-800/50">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-4 w-full px-4 py-3 text-zinc-400 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/10 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
