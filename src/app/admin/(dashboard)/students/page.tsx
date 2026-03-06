import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus } from "lucide-react";

import { CsvImportModal } from "@/components/csv-import-modal";
import { StudentSelectionManager } from "@/components/student-selection-manager";
import { defaultCertificateLayout } from "@/types/certificate";

export default async function AdminStudentsPage() {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("id, first_name, middle_name, last_name, date_entered, date_graduated, hours, modules_completed")
    .order("date_graduated", { ascending: false });

  const { data: layoutSettings } = await supabase
    .from("certificate_settings")
    .select("layout_config")
    .eq("id", 1)
    .single();

  const layoutConfig = layoutSettings?.layout_config || defaultCertificateLayout;

  const studentRows = (students ?? []).map((s) => ({
    id: s.id,
    first_name: s.first_name,
    middle_name: s.middle_name,
    last_name: s.last_name,
    date_entered: s.date_entered,
    date_graduated: s.date_graduated,
    hours: s.hours,
    modules_completed: (s.modules_completed as { title: string; count: number }[]) ?? [],
  }));

  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-8">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Graduates Directory
                </h1>
                <p className="mt-2 text-slate-600">
                  Manage graduates and generate certificate QR codes.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <CsvImportModal />
                <Link href="/admin/students/new">
                  <Button className="gap-2 font-medium shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105">
                    <Plus className="h-5 w-5" />
                    Add Graduate
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Card */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              <Card className="border-slate-200/80 bg-white shadow-card transition-shadow hover:shadow-card-hover">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    Total Graduates
                  </CardTitle>
                  <Users className="h-6 w-6 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-900">
                    {studentRows.length}
                  </p>
                  <Link
                    href="/students"
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    View public list →
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Student List with Bulk Selection */}
            <div className="mt-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  All Graduates
                </h2>
                <p className="text-sm text-slate-500">
                  Select students to bulk-download certificates as PDF
                </p>
              </div>

              {studentRows.length > 0 ? (
                <StudentSelectionManager students={studentRows} layoutConfig={layoutConfig} />
              ) : (
                <Card className="border-slate-200/80 bg-white shadow-card">
                  <CardContent className="py-12 text-center text-slate-600">
                    No graduates yet. Add your first student to get started.
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
