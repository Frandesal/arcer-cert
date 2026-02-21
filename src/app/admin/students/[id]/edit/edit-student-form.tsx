"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { Download, QrCode } from "lucide-react";
import type { Student } from "@/types/database";

type Props = { student: Student };

export function EditStudentForm({ student }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const baseUrl =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_VERIFY_BASE_URL || window.location.origin
      : "";
  const verifyUrl = `${baseUrl}/verify/${student.id}`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const full_name = (formData.get("full_name") as string).trim();
    const date_entered = formData.get("date_entered") as string;
    const date_graduated = formData.get("date_graduated") as string;
    const modulesRaw = (formData.get("modules_completed") as string).trim();
    const modules_completed = modulesRaw
      ? modulesRaw.split(",").map((m) => m.trim()).filter(Boolean)
      : [];

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("students")
      .update({
        full_name,
        date_entered,
        date_graduated,
        modules_completed,
      })
      .eq("id", student.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit graduate</CardTitle>
          <CardDescription>
            Update student details. The QR code remains the same since it is linked to
            this student&apos;s unique ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-md border border-primary/50 bg-primary/10 px-4 py-3 text-sm text-primary-700">
                Changes saved successfully.
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  defaultValue={student.full_name}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date_entered">Date entered *</Label>
                <Input
                  id="date_entered"
                  name="date_entered"
                  type="date"
                  required
                  defaultValue={student.date_entered}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_graduated">Date graduated *</Label>
                <Input
                  id="date_graduated"
                  name="date_graduated"
                  type="date"
                  required
                  defaultValue={student.date_graduated}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modules_completed">Modules completed</Label>
              <Input
                id="modules_completed"
                name="modules_completed"
                placeholder="Module 1, Module 2, Module 3"
                defaultValue={(student.modules_completed || []).join(", ")}
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple modules with commas.
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-700">
            <QrCode className="h-6 w-6" />
            Certificate QR Code
          </CardTitle>
          <CardDescription>
            Download this QR code to add to or replace the certificate.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="rounded-lg border bg-white p-4">
            <QRCodeDisplay url={verifyUrl} size={256} />
          </div>
          <div>
            <a href={`/api/qr/${student.id}`} download={`arcer-certificate-${student.id}.png`}>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download QR Code
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
