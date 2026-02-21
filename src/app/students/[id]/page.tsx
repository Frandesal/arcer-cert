import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QRCodeDisplay } from "@/components/qr-code-display";

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

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-b from-primary/5 to-transparent py-8">
          <div className="container mx-auto max-w-2xl px-4 sm:px-6">
            <Link
              href="/students"
              className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to graduates
            </Link>

            <Card className="border-slate-200/80 bg-white shadow-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-900">
                {student.full_name}
              </CardTitle>
              <p className="text-slate-600">Graduate Profile</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-slate-900">Dates</p>
                  <p className="text-sm text-slate-600">
                    Entered:{" "}
                    {new Date(student.date_entered).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    — Graduated:{" "}
                    {new Date(student.date_graduated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium text-slate-900">Modules Completed</p>
                  <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                    {(student.modules_completed || []).map((m: string, i: number) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <p className="mb-3 font-medium text-slate-900">Certificate QR Code</p>
                <p className="mb-4 text-sm text-slate-600">
                  This unique QR code links to the official verification page for this
                  graduate.
                </p>
                <QRCodeDisplay url={verifyUrl} size={200} />
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
