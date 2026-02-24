import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Megaphone, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AnnouncementCard } from "./announcement-card";

export const metadata = {
  title: "Bulletin Board | Arcer Certificates",
  description: "Stay up to date with the latest news, announcements, and events for Arcer graduates.",
};

export default async function BulletinFeedPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-slate-900 pb-20 pt-16 sm:pb-28 sm:pt-24">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-900/50 to-emerald-900/30" />
          
          <div className="container relative mx-auto max-w-4xl px-4 text-center sm:px-6 z-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 shadow-inner backdrop-blur-md ring-1 ring-white/20">
              <Megaphone className="h-8 w-8 text-primary-200" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
              Arcer Bulletin Board
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300">
              Stay up to date with the latest news, graduation announcements, events, and important updates from the Arcer Registry.
            </p>
          </div>
        </div>

        {/* Feed Section */}
        <div className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 -mt-16 z-20 relative">
          <div className="space-y-12">
            {(posts ?? []).map((post) => (
              <AnnouncementCard key={post.id} post={post} />
            ))}

            {(!posts || posts.length === 0) && (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-slate-50">
                  <Megaphone className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Announcements Yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto">Check back later for the latest news and updates from the Arcer team.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
