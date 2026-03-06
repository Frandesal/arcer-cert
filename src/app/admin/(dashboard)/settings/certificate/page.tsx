import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import { CertificateSettingsManager } from "./certificate-settings-manager";
import { defaultCertificateLayout, CertificateLayoutConfig } from "@/types/certificate";

export default async function CertificateSettingsPage() {
  const admin = await isAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  
  // Attempt to fetch the configured layout
  const { data } = await supabase
    .from("certificate_settings")
    .select("layout_config")
    .eq("id", 1)
    .single();

  const currentLayout: CertificateLayoutConfig = data?.layout_config 
    ? (data.layout_config as CertificateLayoutConfig)
    : defaultCertificateLayout;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <main className="flex-1 overflow-hidden">
        <div className="bg-gradient-to-b from-primary/5 to-transparent h-full flex flex-col">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 flex-shrink-0">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Certificate Layout Editor
              </h1>
              <p className="mt-2 text-slate-600">
                Adjust the position and size of the certificate text overlays and QR code visually.
              </p>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden pb-6">
             <CertificateSettingsManager initialLayout={currentLayout} />
          </div>
        </div>
      </main>
    </div>
  );
}
