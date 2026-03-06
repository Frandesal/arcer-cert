import { BaseCertificate } from "@/components/base-certificate";
import { createClient } from "@/lib/supabase/server";
import { defaultCertificateLayout } from "@/types/certificate";

export default async function CertificateTestPage() {
  const testStudent = {
    id: "test-preview-id",
    firstName: "Frandilbert",
    middleName: "Longno",
    lastName: "Peruso",
    dateEntered: "2026-01-24",
    dateGraduated: "2026-02-14",
    modulesCompleted: [
      { title: "MS Word", count: 12 },
      { title: "MS Excel", count: 8 },
    ],
  };

  const supabase = await createClient();
  const { data: layoutSettings } = await supabase
    .from("certificate_settings")
    .select("layout_config")
    .eq("id", 1)
    .single();

  const layoutConfig = layoutSettings?.layout_config || defaultCertificateLayout;

  return (
    <div style={{ overflow: "auto", padding: "20px", background: "#333" }}>
      <h1 style={{ color: "#fff", marginBottom: "10px", fontFamily: "sans-serif" }}>
        Certificate Preview (scroll to see full size)
      </h1>
      <div style={{ border: "3px solid red", display: "inline-block" }}>
        <BaseCertificate data={testStudent} layout={layoutConfig} />
      </div>
    </div>
  );
}
