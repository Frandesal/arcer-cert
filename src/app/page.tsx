import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ShieldCheck, Users } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "./hero-section";
import { FeatureCards } from "./feature-cards";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <FeatureCards />
      </main>

      <Footer />
    </div>
  );
}
