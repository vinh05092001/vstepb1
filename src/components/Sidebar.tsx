"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, MessageCircle, User, Zap, LayoutTemplate, Timer, Brain } from "lucide-react";

export const navItems = [
  { href: "/", icon: Home, label: "Dashboard", mobileLabel: "Home" },
  { href: "/memorize", icon: Brain, label: "Memorize", mobileLabel: "Memorize" },
  { href: "/speaking", icon: MessageCircle, label: "Speaking", mobileLabel: "Speaking" },
  { href: "/writing", icon: BookOpen, label: "Writing", mobileLabel: "Writing" },
  { href: "/vocabulary", icon: Zap, label: "Vocabulary", mobileLabel: "Vocab" },
  { href: "/grammar-chunks", icon: LayoutTemplate, label: "Grammar & Chunks", mobileLabel: "Grammar" },
  { href: "/exam-simulation", icon: Timer, label: "Mock Test", mobileLabel: "Test" },
  { href: "/insights", icon: User, label: "Progress", mobileLabel: "Progress" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex flex-col w-64 h-screen border-r border-surface-border fixed left-0 top-0 p-4 bg-surface-100 z-50">
      <div className="mb-8 mt-4 px-4">
        <h1 className="text-2xl font-black text-accent-primary tracking-tight">VSTEP AI Pro</h1>
      </div>
      
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold tracking-wide text-sm transition-all ${
                isActive
                  ? "bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
                  : "text-gray-600 hover:bg-surface-200 hover:text-gray-900 border border-transparent"
              }`}
            >
              <item.icon className="w-6 h-6" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
