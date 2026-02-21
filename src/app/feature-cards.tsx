"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ShieldCheck, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: GraduationCap,
    title: "Verified Graduates",
    description:
      "All students who complete our programs receive an official certificate with a unique verification code.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Trusted",
    description:
      "Each certificate is cryptographically linked to our registry. Scan the QR code to verify authenticity.",
  },
  {
    icon: Users,
    title: "Full Transparency",
    description:
      "View graduate profiles including completion dates and modules completed. Public and searchable.",
  },
];

export function FeatureCards() {
  return (
    <section className="container mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="group h-full border-slate-200/80 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-card-hover">
              <CardHeader className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-emerald-100 text-primary transition-transform group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-base font-semibold text-slate-900">
                  {feature.title}
                </CardTitle>
                <CardDescription className="leading-relaxed text-slate-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
