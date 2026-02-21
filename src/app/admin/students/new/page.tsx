import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { AddStudentForm } from "./add-student-form";
import { ArrowLeft } from "lucide-react";
import { AdminHeader } from "@/components/layout/admin-header";
import { Footer } from "@/components/layout/footer";

export default async function AddStudentPage() {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AdminHeader />

      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-8">
          <div className="container mx-auto max-w-2xl px-4 sm:px-6">
            <Link
              href="/admin"
              className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>

            <AddStudentForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
