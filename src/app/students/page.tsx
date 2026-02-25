import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { StudentsSearch } from "./students-search";
import { Suspense } from "react";

export default async function StudentsPage() {
  const supabase = await createClient();
  const { data: studentsRaw, error } = await supabase
    .from("students")
    .select("id, first_name, middle_name, last_name, date_graduated")
    .order("date_graduated", { ascending: false });

  const students = (studentsRaw || []).map(s => ({
    id: s.id,
    full_name: [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(" "),
    date_graduated: s.date_graduated
  }));

  const isSetupError =
    error?.code === "PGRST205" ||
    (error?.message && error.message.includes("schema cache"));

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <div className="relative bg-gradient-to-b from-primary/5 to-transparent py-8">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Graduate Registry
              </h1>
              <p className="mt-2 text-slate-600">
                Browse all verified graduates. Click on a student to view their full profile
                and certificate details.
              </p>
            </div>

        {isSetupError ? (
          <Card className="border-amber-200/80 bg-amber-50/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-amber-800">Database setup required</CardTitle>
              <CardDescription className="text-amber-700/80">
                The students table has not been created yet. Run the migration in your
                Supabase project to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-amber-800/90">
                1. Open Supabase Dashboard → SQL Editor
                <br />
                2. Copy and run the SQL from{" "}
                <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">
                  supabase/migrations/001_initial_schema.sql
                </code>
                <br />
                3. Refresh this page
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Suspense fallback={<div className="py-12 flex justify-center text-slate-400 animate-pulse">Loading directory...</div>}>
              <StudentsSearch initialStudents={students ?? []} />
            </Suspense>

            {(!students || students.length === 0) && (
              <Card className="border-slate-200/80 bg-white shadow-card">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <GraduationCap className="mb-4 h-16 w-16 text-slate-300" />
                  <p className="text-lg font-medium text-slate-900">No graduates yet</p>
                  <p className="text-slate-600">
                    Graduates will appear here once they complete the program.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
