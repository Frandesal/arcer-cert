import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { VerifyCard } from "./verify-card";

type Props = { params: Promise<{ id: string }> };

export default async function VerifyPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: student, error } = await supabase
    .from("students")
    .select("id, full_name, date_graduated")
    .eq("id", id)
    .single();

  if (error || !student) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-emerald-50/30 to-teal-50/20 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]" />
      <VerifyCard student={student} />
    </div>
  );
}
