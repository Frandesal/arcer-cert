"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { Download, QrCode, Plus, Trash2, Loader2 } from "lucide-react";
import type { Student } from "@/types/database";

type Props = { student: Student };
type ModuleInput = { title: string; count: number };

export function EditStudentForm({ student }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Default to at least one empty module if none exist
  const initialModules = student.modules_completed && student.modules_completed.length > 0 
    ? student.modules_completed 
    : [{ title: "", count: 1 }];

  const [modules, setModules] = useState<ModuleInput[]>(initialModules);
  const router = useRouter();

  const baseUrl =
    typeof window !== "undefined"
      ? process.env.NEXT_PUBLIC_VERIFY_BASE_URL || window.location.origin
      : "";
  const verifyUrl = `${baseUrl}/verify/${student.id}`;

  const handleAddModule = () => {
    setModules([...modules, { title: "", count: 1 }]);
  };

  const handleRemoveModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handleModuleChange = (index: number, field: keyof ModuleInput, value: string | number) => {
    const newModules = [...modules];
    newModules[index] = { ...newModules[index], [field]: value };
    setModules(newModules);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const first_name = (formData.get("first_name") as string).trim();
    const middle_name = (formData.get("middle_name") as string)?.trim() || null;
    const last_name = (formData.get("last_name") as string).trim();
    
    const date_entered = formData.get("date_entered") as string;
    const date_graduated = formData.get("date_graduated") as string;
    
    // Filter out any empty modules
    const modules_completed = modules.filter(m => m.title.trim() !== "");

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("students")
      .update({
        first_name,
        middle_name,
        last_name,
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
    
    // Refresh to update server-rendered layouts if needed
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/80 bg-white shadow-card">
        <CardHeader>
          <CardTitle>Edit graduate</CardTitle>
          <CardDescription>
            Update student details. The QR code remains the same since it is linked to
            this student&apos;s unique ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
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

            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Personal Information</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First name *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    required
                    defaultValue={student.first_name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middle_name">Middle name</Label>
                  <Input
                    id="middle_name"
                    name="middle_name"
                    defaultValue={student.middle_name || ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last name *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    required
                    defaultValue={student.last_name}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-slate-900">Program Details</h3>
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
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Modules Completed</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddModule} className="gap-1 h-8">
                  <Plus className="h-3.5 w-3.5" />
                  Add Module
                </Button>
              </div>
              
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <div key={index} className="flex items-end gap-2 sm:gap-4 p-3 border rounded-lg bg-slate-50/50">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs text-slate-500">Module Title</Label>
                      <Input
                        placeholder="e.g. Microsoft Word"
                        value={module.title}
                        onChange={(e) => handleModuleChange(index, "title", e.target.value)}
                        required
                      />
                    </div>
                    <div className="w-24 space-y-2">
                      <Label className="text-xs text-slate-500">Count</Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="10"
                        value={module.count}
                        onChange={(e) => handleModuleChange(index, "count", parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    {modules.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:text-destructive h-10 w-10 flex-shrink-0"
                        onClick={() => handleRemoveModule(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {modules.length === 0 && (
                  <p className="text-sm text-slate-500 italic py-2 text-center border border-dashed rounded-lg">No modules added</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2"/> Saving...</> : "Save changes"}
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

      <Card className="border-slate-200/80 bg-white shadow-card">
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
          <div className="rounded-lg border bg-slate-50 p-4">
            <QRCodeDisplay url={verifyUrl} size={192} />
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
