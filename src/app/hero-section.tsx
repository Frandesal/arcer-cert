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
            Certificate{" "}
            <span className="text-primary">
              Verification
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl"
          >
            Verify that graduates have successfully completed our programs. Each
            certificate includes a unique QR code for instant verification.
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
                Browse Graduates
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
