"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, QrCode } from "lucide-react";
import { QRCodeDisplay } from "@/components/qr-code-display";

export function AddStudentForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdStudent, setCreatedStudent] = useState<{
    id: string;
    full_name: string;
    verifyUrl: string;
  } | null>(null);

  const router = useRouter();

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
    const { data, error: insertError } = await supabase
      .from("students")
      .insert({
        full_name,
        date_entered,
        date_graduated,
        modules_completed,
      })
      .select("id, full_name")
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_VERIFY_BASE_URL || window.location.origin;
    setCreatedStudent({
      id: data.id,
      full_name: data.full_name,
      verifyUrl: `${baseUrl}/verify/${data.id}`,
    });
    setLoading(false);
  }

  if (createdStudent) {
    return (
      <Card className="border-slate-200/80 bg-white shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary-700">
            <QrCode className="h-6 w-6" />
            Student added successfully
          </CardTitle>
          <CardDescription>
            Download the QR code below and add it to {createdStudent.full_name}&apos;s
            certificate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="rounded-lg border bg-white p-4">
              <QRCodeDisplay url={createdStudent.verifyUrl} size={256} />
            </div>
            <div className="space-y-3">
              <p className="font-medium">{createdStudent.full_name}</p>
              <a
                href={`/api/qr/${createdStudent.id}`}
                download={`arcer-certificate-${createdStudent.id}.png`}
              >
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Download QR Code
                </Button>
              </a>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setCreatedStudent(null);
              }}
            >
              Add another student
            </Button>
            <Button onClick={() => router.push("/admin")}>Go to dashboard</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/80 bg-white shadow-card">
      <CardHeader>
        <CardTitle>Add new graduate</CardTitle>
        <CardDescription>
          Fill in the details below. After saving, a unique QR code will be generated
          for the certificate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name *</Label>
              <Input
                id="full_name"
                name="full_name"
                required
                placeholder="Jane Doe"
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date_graduated">Date graduated *</Label>
              <Input
                id="date_graduated"
                name="date_graduated"
                type="date"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modules_completed">Modules completed</Label>
            <Input
              id="modules_completed"
              name="modules_completed"
              placeholder="Module 1, Module 2, Module 3"
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple modules with commas.
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save & generate QR"}
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
  );
}
