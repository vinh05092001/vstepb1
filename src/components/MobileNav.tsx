"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./Sidebar";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-surface-border bg-surface-100/95 backdrop-blur-sm">
      <div className="hide-scrollbar flex items-stretch gap-1 overflow-x-auto px-2 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-w-[72px] flex-shrink-0 flex-col items-center justify-center rounded-[12px] px-2 py-2 transition-all duration-200 ${
              isActive ? "bg-[#6366F1]/12 text-[#6366F1]" : "text-gray-500 hover:bg-[#6366F1]/5 hover:text-gray-900"
            }`}
          >
            <item.icon className={`mb-1 h-5 w-5 transition-transform ${isActive ? "scale-110 text-[#6366F1]" : "text-gray-500"}`} />
            <span className={`whitespace-nowrap text-[10px] font-bold tracking-wide ${isActive ? "opacity-100" : "opacity-80"}`}>
              {item.mobileLabel ?? item.label}
            </span>
          </Link>
        );
        })}
      </div>
    </nav>
  );
}
