import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Megaphone, Presentation, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminMetricsDashboard() {
  const supabase = await createClient();

  // Aggregate Metrics
  const { data: students } = await supabase.from("students").select("id, date_graduated, modules_completed").order("date_graduated", { ascending: false });
  const { data: announcements } = await supabase.from("announcements").select("id, created_at, title").order("created_at", { ascending: false });

  // Calculations
  const totalGraduates = students?.length ?? 0;
  const totalAnnouncements = announcements?.length ?? 0;
  
  let totalModulesCompleted = 0;
  students?.forEach((s) => {
    if (Array.isArray(s.modules_completed)) {
      totalModulesCompleted += s.modules_completed.length;
    }
  });

  return (
    <div className="p-6 sm:p-10 space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="mt-2 text-slate-600">
          High-level metrics and recent activity for the Arcer Registry.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Graduates</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{totalGraduates}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Posts</CardTitle>
            <Megaphone className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{totalAnnouncements}</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Modules Completed</CardTitle>
            <Presentation className="h-5 w-5 text-fuchsia-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{totalModulesCompleted}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Activity: Students */}
        <Card className="border-slate-200/80 shadow-sm h-fit">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base font-semibold">Latest Graduates</CardTitle>
            <Link href="/admin/students">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary">View all &rarr;</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {(students ?? []).slice(0, 5).map((s) => (
                <div key={s.id} className="p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="bg-primary/10 p-2 rounded-md"><Users className="h-4 w-4 text-primary" /></div>
                     <span className="text-sm font-medium text-slate-900">New Graduate Registered</span>
                   </div>
                   <span className="text-xs text-slate-500 flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5"/> {new Date(s.date_graduated).toLocaleDateString()}</span>
                </div>
              ))}
              {(!students || students.length === 0) && (
                <div className="p-8 text-center text-sm text-slate-500">No graduates found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity: Announcements */}
        <Card className="border-slate-200/80 shadow-sm h-fit">
           <CardHeader className="border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base font-semibold">Recent Posts</CardTitle>
            <Link href="/admin/bulletin">
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">View all &rarr;</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-slate-100">
              {(announcements ?? []).slice(0, 5).map((a) => (
                <div key={a.id} className="p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                   <div className="flex items-center gap-3">
                     <div className="bg-blue-50 p-2 rounded-md"><Megaphone className="h-4 w-4 text-blue-500" /></div>
                     <span className="text-sm font-medium text-slate-900 truncate max-w-[200px] sm:max-w-xs">{a.title}</span>
                   </div>
                   <span className="text-xs text-slate-500 flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5"/> {new Date(a.created_at).toLocaleDateString()}</span>
                </div>
              ))}
               {(!announcements || announcements.length === 0) && (
                <div className="p-8 text-center text-sm text-slate-500">No posts found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
