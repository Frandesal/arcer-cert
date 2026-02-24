import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { EditStudentForm } from "./edit-student-form";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function EditStudentPage({ params }: Props) {
  const { id } = await params;
  const admin = await isAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !student) {
    notFound();
  }

  return (
    <div className="flex flex-col">

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

            <EditStudentForm student={student} />
          </div>
        </div>
      </main>

    </div>
  );
}
