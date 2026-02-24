"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AdminSidebar } from "./admin-sidebar";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu automatically when the user clicks a link and navigates
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="md:hidden flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sticky top-0 z-40">
      <span className="font-bold text-slate-900 tracking-tight">Arcer Admin</span>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="p-2 -mr-2 text-slate-600 focus:outline-none" aria-label="Open Menu">
             <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 border-none [&>button]:hidden">
          <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
          {/* Reuse the existing Sidebar directly inside the Sheet */}
          <AdminSidebar />
        </SheetContent>
      </Sheet>
    </header>
  );
}
