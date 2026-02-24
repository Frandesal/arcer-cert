"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-emerald-50/50 to-teal-50/30" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.15),transparent)]" />

      <div className="container mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
          >
            Arcer{" "}
            <span className="text-primary">
              Registry & Portal
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl"
          >
            Welcome to the official Arcer platform. Browse the latest announcements below, or verify a graduate via the public registry.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link href="/students">
              <Button
                size="lg"
                className="h-12 gap-2 px-6 font-medium shadow-none bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.02]"
              >
                <Users className="h-5 w-5" />
                Search Registry
              </Button>
            </Link>
            <Link href="/admin">
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 px-6 font-medium"
              >
                <ShieldCheck className="h-5 w-5" />
                Admin Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
