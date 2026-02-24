import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "./hero-section";
import { AnnouncementCard } from "./announcement-card";
import { Megaphone } from "lucide-react";

export default async function HomePage() {
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
        <HeroSection />
        
        {/* Bulletin Feed Section */}
        <section id="announcements" className="container mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 z-20 relative">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Latest Announcements</h2>
            <p className="mt-4 text-lg text-slate-600">News, updates, and event information from the Arcer Registry.</p>
          </div>

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
        </section>
      </main>

      <Footer />
    </div>
  );
}
