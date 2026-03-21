import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, BookOpen, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import { parseLocalDate } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function StudentProfilePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !student) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_VERIFY_BASE_URL || "";
  const verifyUrl = `${baseUrl}/verify/${student.id}`;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    return parseLocalDate(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const fullName = [student.first_name, student.middle_name, student.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <div className="relative overflow-hidden bg-slate-900 pb-32 pt-16">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
          <div className="container relative mx-auto max-w-3xl px-4 sm:px-6">
            <Link
              href="/students"
              className="mb-8 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to graduates
            </Link>
          </div>
        </div>

        <div className="container mx-auto max-w-3xl px-4 sm:px-6 -mt-32 pb-24 z-10 relative">
          <Card className="overflow-hidden border-0 bg-white shadow-2xl ring-1 ring-slate-900/5">
            {/* Certificate Header Pattern */}
            <div className="relative h-32 bg-gradient-to-r from-primary/90 to-primary sm:h-40 overflow-hidden">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3 sm:bottom-8 sm:left-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 shadow-inner backdrop-blur-md ring-1 ring-white/30 sm:h-16 sm:w-16">
                  <Award className="h-8 w-8 text-white drop-shadow-sm" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
                    {fullName}
                  </h1>
                  <p className="text-primary-foreground/80 font-medium tracking-wide text-sm uppercase flex items-center gap-1.5 mt-1">
                    <ShieldCheck className="w-4 h-4" /> Official Graduate
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[1fr,240px] md:gap-12 lg:p-10">
              <div className="space-y-8">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
                    <Calendar className="h-5 w-5 text-primary" /> Program Timeline
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
                      <p className="text-sm font-medium text-slate-500 mb-1">Date Entered</p>
                      <p className="font-semibold text-slate-900">{formatDate(student.date_entered)}</p>
                    </div>
                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 transition-colors hover:bg-primary/10">
                      <p className="text-sm font-medium text-primary/80 mb-1">Date Graduated</p>
                      <p className="font-semibold text-primary-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {formatDate(student.date_graduated)}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-4">
                    <BookOpen className="h-5 w-5 text-primary" /> Modules Completed
                  </h3>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 md:p-8">
                    <ul className="flex flex-wrap gap-4">
                      {(student.modules_completed || []).map((m: { title: string, count: number }, i: number) => (
                        <li key={i} className="relative flex min-w-[200px] flex-1 items-center overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-md sm:min-w-[240px]">
                          <div className="flex flex-1 items-center gap-3 p-4 pr-0">
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/5">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-semibold text-slate-800 leading-tight pr-2">
                              {m.title}
                            </span>
                          </div>
                          
                          <div className="relative flex h-full min-w-[80px] flex-col items-center justify-center bg-primary/10 px-4 py-3 text-primary ml-auto">
                            <div className="absolute -left-6 top-0 h-full w-12 -skew-x-12 bg-primary/10" />
                            <span className="relative z-10 text-lg font-bold leading-none">{m.count}</span>
                            <span className="relative z-10 text-[10px] font-semibold uppercase tracking-wider mt-0.5">
                              {m.count === 1 ? 'Module' : 'Modules'}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* QR Code Sidebar */}
              <div className="flex flex-col items-center justify-start self-start rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 pt-10 pb-8 transition-colors hover:border-primary/30">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="relative mb-8 group outline-none cursor-zoom-in">
                      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-primary/30 to-primary/0 opacity-0 blur backdrop-blur-3xl transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                      <div className="relative rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-900/5 transition-transform duration-300 group-hover:scale-[1.02]">
                         <QRCodeDisplay url={verifyUrl} size={180} />
                         <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-primary/5 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                           <div className="flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-lg">
                             <Maximize2 className="h-3.5 w-3.5" /> Enlarge
                           </div>
                         </div>
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-12">
                     <p className="font-semibold text-slate-900 mb-6 text-xl">Official Certificate QR</p>
                     <div className="rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-900/5">
                       <QRCodeDisplay url={verifyUrl} size={320} />
                     </div>
                     <p className="text-sm text-slate-500 mt-8 text-center balance leading-relaxed">
                       Scan this code with any smartphone camera to verify the authenticity of this certificate on the Arcer registry.
                     </p>
                  </DialogContent>
                </Dialog>
                
                <div className="text-center space-y-2">
                  <p className="font-semibold text-slate-900 text-[15px]">Official Certificate</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed balance max-w-[200px] mx-auto">
                    Scan to verify authenticity of this graduate&apos;s credentials.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
               <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Verification Id: <span className="font-mono text-slate-500 ml-1">{student.id.split("-")[0]}</span></p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
