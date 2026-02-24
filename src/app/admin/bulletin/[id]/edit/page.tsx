import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/layout/admin-header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BulletinForm } from "../../new/bulletin-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditBulletinPage({ params }: Props) {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const supabase = await createClient();
  const { data: announcement, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !announcement) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AdminHeader />

      <main className="flex-1 py-8">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/admin/bulletin"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bulletin Board
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Edit Announcement
            </h1>
            <p className="mt-2 text-slate-600">
              Update the details or images for this post.
            </p>
          </div>

          <BulletinForm initialData={{
             id: announcement.id,
             title: announcement.title,
             content: announcement.content,
             images: announcement.images || [],
             is_published: announcement.is_published
          }} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
