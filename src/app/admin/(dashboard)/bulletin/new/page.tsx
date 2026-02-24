import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BulletinForm } from "./bulletin-form";

export default async function NewBulletinPage() {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col">

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
              Create Announcement
            </h1>
            <p className="mt-2 text-slate-600">
              Draft a new public announcement and upload accompanying images.
            </p>
          </div>

          <BulletinForm />
        </div>
      </main>

    </div>
  );
}
