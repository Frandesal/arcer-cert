"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, Menu, X } from "lucide-react";
import { AdminLogout } from "@/app/admin/admin-logout";
import { motion, AnimatePresence } from "framer-motion";

export function AdminHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-slate-900"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-700 text-white shadow-md">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="hidden sm:inline">Arcer Admin</span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <Link href="/admin">
            <Button variant="ghost" className="font-medium text-slate-700">
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/students/new">
            <Button className="gap-2 font-medium">
              <Plus className="h-4 w-4" />
              Add Student
            </Button>
          </Link>
          <AdminLogout />
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-slate-200/80 bg-white md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              <Link href="/admin" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/students/new" onClick={() => setMobileOpen(false)}>
                <Button className="w-full justify-start gap-2">
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </Link>
              <div className="pt-2">
                <AdminLogout />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
