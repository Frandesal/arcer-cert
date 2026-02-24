import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Megaphone, Plus } from "lucide-react";

import { DeleteBulletinDialog } from "@/components/delete-bulletin-dialog";

export default async function AdminBulletinPage() {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: announcements } = await supabase
    .from("announcements")
    .select("id, title, is_published, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col">

      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-8">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  <Megaphone className="h-8 w-8 text-primary" /> Bulletin Board
                </h1>
                <p className="mt-2 text-slate-600">
                  Manage public announcements, news, and image galleries.
                </p>
              </div>
              <Link href="/admin/bulletin/new">
                <Button className="gap-2 font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105">
                  <Plus className="h-5 w-5" />
                  Create Post
                </Button>
              </Link>
            </div>

            <div className="mt-8">
              <div className="space-y-3">
                {(announcements ?? []).map((post) => (
                  <Card key={post.id} className="border-slate-200/80 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-card-hover group">
                    <CardHeader className="flex flex-row items-center justify-between py-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-slate-900 group-hover:text-primary transition-colors text-lg">
                            {post.title}
                          </p>
                          {post.is_published ? (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">Published</span>
                          ) : (
                            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Draft</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 font-medium">
                          Created {new Date(post.created_at).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/bulletin/${post.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <DeleteBulletinDialog bulletinId={post.id} bulletinTitle={post.title} />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              {(!announcements || announcements.length === 0) && (
                <Card className="border-slate-200/80 bg-white shadow-sm">
                  <CardContent className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                       <Megaphone className="h-8 w-8 text-primary/50" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">No Announcements Yet</h3>
                    <p className="text-slate-500 max-w-sm">Create your first public announcement to share news with graduates and visitors.</p>
                    <Link href="/admin/bulletin/new" className="mt-6">
                      <Button variant="outline">Create Post</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
