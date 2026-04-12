"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  ShoppingCart,
  Gift,
  FileText,
  Settings,
  Plug,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/admin", label: "Дашборд", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Продукты", icon: BookOpen },
  { href: "/admin/orders", label: "Заказы", icon: ShoppingCart },
  { href: "/admin/gift-certificates", label: "Сертификаты", icon: Gift },
  { href: "/admin/pages", label: "Страницы", icon: FileText },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
  { href: "/admin/integrations/getcourse", label: "Интеграции", icon: Plug },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-[var(--sidebar-bg)] text-[var(--sidebar-fg)]">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Админ-панель</p>
        <p className="text-white font-semibold text-sm leading-tight">Светлана Масалова</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-[var(--sidebar-accent)] text-white font-medium"
                  : "text-[var(--sidebar-fg)] hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--sidebar-fg)] hover:bg-white/10 hover:text-white transition-colors w-full"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Выйти
        </button>
      </div>
    </aside>
  );
}
