import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { AdminLoginForm } from "./admin-login-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

export default async function AdminLoginPage() {
  const admin = await isAdmin();
  if (admin) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-emerald-50/30 to-teal-50/20 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.1),transparent)]" />
      <Link
        href="/"
        className="relative mb-8 flex items-center gap-2.5 font-semibold text-slate-900"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-700 text-white shadow-md">
          <GraduationCap className="h-5 w-5" />
        </div>
        Arcer Registry
      </Link>

      <Card className="relative w-full max-w-md border-slate-200/80 bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl text-slate-900">Admin Login</CardTitle>
          <CardDescription className="text-slate-600">
            Sign in with your admin credentials to manage graduates and certificates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm />
        </CardContent>
      </Card>

      <Link href="/" className="relative mt-6">
        <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
          ← Back to home
        </Button>
      </Link>
    </div>
  );
}
