"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AdminLogout() {
  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    // Hard navigation to force the server to re-evaluate the cookie
    window.location.href = "/admin/login";
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}
