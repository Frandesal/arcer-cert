"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { Calendar, BookOpen, CheckCircle2 } from "lucide-react";

type StudentData = {
  id: string;
  fullName: string;
  date_entered: string | null;
  date_graduated: string;
  modules_completed: { title: string; count: number }[];
};

type Props = {
  student: StudentData;
};

export function AdminStudentViewModal({ student }: Props) {
  const baseUrl =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_VERIFY_BASE_URL || window.location.origin
      : "";
  const verifyUrl = `${baseUrl}/verify/${student.id}`;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 overflow-hidden bg-slate-50">
        <div className="bg-gradient-to-r from-primary/90 to-primary p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold tracking-tight mb-1">{student.fullName}</h2>
            <p className="text-primary-100 font-medium text-sm flex items-center gap-1.5 opacity-90">
              <span className="font-mono text-xs opacity-70">ID: {student.id.split("-")[0]}</span>
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid gap-8 md:grid-cols-[1fr,200px]">
          <div className="space-y-8">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                <Calendar className="h-4 w-4 text-primary" /> Timeline
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50">
                  <p className="text-xs font-medium text-slate-500 mb-1">Date Entered</p>
                  <p className="font-semibold text-slate-800 text-sm">
                    {formatDate(student.date_entered)}
                  </p>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="text-xs font-medium text-primary/80 mb-1">Date Graduated</p>
                  <p className="font-semibold text-primary-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    {formatDate(student.date_graduated)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                <BookOpen className="h-4 w-4 text-primary" /> Modules Focus
              </h3>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <ul className="flex flex-col gap-3">
                  {(student.modules_completed || []).map((m, i) => (
                    <li key={i} className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{m.title}</span>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {m.count}
                      </span>
                    </li>
                  ))}
                  {(!student.modules_completed || student.modules_completed.length === 0) && (
                    <li className="text-sm text-slate-500 italic">No modules recorded.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-start pt-2">
             <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200 mb-4 inline-block">
               <QRCodeDisplay url={verifyUrl} size={140} />
             </div>
             <a
               href={`/api/qr/${student.id}`}
               download={`arcer-certificate-${student.id}.png`}
               className="w-full"
             >
               <Button variant="outline" className="w-full text-xs h-8">
                 Download QR
               </Button>
             </a>
             <a
               href={`/students/${student.id}`}
               target="_blank"
               className="w-full mt-2"
             >
               <Button variant="ghost" className="w-full text-xs h-8 text-primary hover:text-primary hover:bg-primary/5">
                 Open Public Page
               </Button>
             </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
