"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, QrCode, Plus, Trash2 } from "lucide-react";
import { QRCodeDisplay } from "@/components/qr-code-display";

type ModuleInput = {
  title: string;
  count: number | "";
};

export function AddStudentForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dynamic Module State
  const [modules, setModules] = useState<ModuleInput[]>([
    { title: "MS Word", count: "" },
    { title: "MS Excel", count: "" },
    { title: "MS PowerPoint", count: "" },
    { title: "Adobe Photoshop", count: "" },
    { title: "Canva", count: "" }
  ]);

  const [createdStudent, setCreatedStudent] = useState<{
    id: string;
    first_name: string;
    last_name: string;
    verifyUrl: string;
  } | null>(null);

  const router = useRouter();

  const handleAddModule = () => {
    setModules([...modules, { title: "", count: "" }]);
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

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const first_name = (formData.get("first_name") as string).trim();
    const middle_name = (formData.get("middle_name") as string)?.trim() || null;
    const last_name = (formData.get("last_name") as string).trim();
    
    const date_entered = formData.get("date_entered") as string;
    const date_graduated = formData.get("date_graduated") as string;
    
    // Filter out any empty modules
    const modules_completed = modules
      .filter(m => m.title.trim() !== "")
      .map(m => ({
        title: m.title.trim(),
        count: m.count === "" ? 1 : m.count
      }));

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("students")
      .insert({
        first_name,
        middle_name,
        last_name,
        date_entered,
        date_graduated,
        modules_completed,
      })
      .select("id, first_name, last_name")
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
      first_name: data.first_name,
      last_name: data.last_name,
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
            Download the QR code below and add it to {createdStudent.first_name}&apos;s
            certificate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="rounded-lg border bg-white p-4">
              <QRCodeDisplay url={createdStudent.verifyUrl} size={256} />
            </div>
            <div className="space-y-3">
              <p className="font-medium text-xl">{createdStudent.first_name} {createdStudent.last_name}</p>
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
                setModules([
                  { title: "MS Word", count: "" },
                  { title: "MS Excel", count: "" },
                  { title: "MS PowerPoint", count: "" },
                  { title: "Adobe Photoshop", count: "" },
                  { title: "Canva", count: "" }
                ]);
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
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name *</Label>
                <Input id="first_name" name="first_name" required placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle_name">Middle name</Label>
                <Input id="middle_name" name="middle_name" placeholder="Marie" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last name *</Label>
                <Input id="last_name" name="last_name" required placeholder="Doe" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Program Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date_entered">Date entered *</Label>
                <Input id="date_entered" name="date_entered" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_graduated">Date graduated *</Label>
                <Input id="date_graduated" name="date_graduated" type="date" required />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Modules Completed (Title & Count)</Label>
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
                      onChange={(e) => {
                        const val = e.target.value;
                        handleModuleChange(index, "count", val === "" ? "" : parseInt(val));
                      }}
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
