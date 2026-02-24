"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, LayoutDashboard, Users, Megaphone, Plus, Search } from "lucide-react";
import { AdminLogout } from "@/app/admin/admin-logout";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/students", label: "Graduates Directory", icon: Users, exact: false },
  { href: "/admin/bulletin", label: "Bulletin Board", icon: Megaphone, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex w-64 flex-col border-r border-slate-200/80 bg-white shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] z-10 sticky top-0 h-screen">
      <div className="flex h-16 items-center border-b border-transparent px-6 py-4">
        <Link
          href="/admin"
          className="flex items-center gap-3 font-semibold tracking-tight text-slate-900 transition-opacity hover:opacity-90"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-700 text-white shadow-md">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="text-lg">Arcer Admin</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto pt-6 pb-4 flex flex-col gap-6">
        {/* Main Navigation */}
        <div className="px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
              
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-500")} />
                  {link.label}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="px-4 border-t border-slate-100 pt-6">
          <p className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Quick Actions
          </p>
          <div className="space-y-2">
            <Link href="/admin/students/new">
              <Button className="w-full justify-start gap-3 shadow-none bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50 transition-colors">
                <div className="bg-white rounded-md p-1 shadow-sm"><Plus className="h-3 w-3 text-emerald-600" /></div>
                Add Graduate
              </Button>
            </Link>
            <Link href="/admin/bulletin/new">
              <Button className="w-full justify-start gap-3 shadow-none bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors">
                <div className="bg-white rounded-md p-1 shadow-sm"><Megaphone className="h-3 w-3 text-slate-500" /></div>
                New Post
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/80 p-4">
        <Link href="/" className="mb-4 block text-center">
            <Button variant="link" className="w-full justify-center text-slate-500 h-auto py-2 text-sm hover:text-slate-900 transition-colors">
                View Public Registry <Search className="w-3.5 h-3.5 ml-1.5" />
            </Button>
        </Link>
        <AdminLogout />
      </div>
    </div>
  );
}
