import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { AdminHeader } from "@/components/layout/admin-header";
import { Footer } from "@/components/layout/footer";

export default async function AdminDashboardPage() {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("id, full_name, date_graduated")
    .order("date_graduated", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <AdminHeader />

      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-8">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-slate-600">
                Manage graduates and generate certificate QR codes.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-slate-200/80 bg-white shadow-card transition-shadow hover:shadow-card-hover">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    Total Graduates
                  </CardTitle>
                  <Users className="h-6 w-6 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-900">
                    {students?.length ?? 0}
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

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-semibold text-slate-900">
                Recent Graduates
              </h2>
              <div className="space-y-3">
                {(students ?? []).slice(0, 10).map((s) => (
                  <Link key={s.id} href={`/admin/students/${s.id}/edit`}>
                    <Card className="border-slate-200/80 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-card-hover">
                      <CardHeader className="flex flex-row items-center justify-between py-4">
                        <div>
                          <p className="font-medium text-slate-900">{s.full_name}</p>
                          <p className="text-sm text-slate-600">
                            Graduated:{" "}
                            {new Date(s.date_graduated).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
              {(!students || students.length === 0) && (
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

      <Footer />
    </div>
  );
}
