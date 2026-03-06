"use client";

import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { BaseCertificate } from "./base-certificate";
import { useCertificateGenerator } from "@/hooks/useCertificateGenerator";
import type { CertificateStudentData } from "@/hooks/useCertificateGenerator";

import type { CertificateLayoutConfig } from "@/types/certificate";

interface DownloadCertificateButtonProps {
  student: CertificateStudentData;
  layoutConfig: CertificateLayoutConfig;
}

export function DownloadCertificateButton({ student, layoutConfig }: DownloadCertificateButtonProps) {
  const {
    isGenerating,
    generatingStatus,
    renderingStudent,
    certificateRef,
    downloadSingleCertificate,
  } = useCertificateGenerator();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => downloadSingleCertificate(student)}
        disabled={isGenerating}
        title={isGenerating ? generatingStatus : "Download Certificate"}
        className="gap-1.5"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
        {isGenerating ? "Generating..." : "Certificate"}
      </Button>

      {/* Hidden Off-Screen Renderer */}
      <div
        style={{
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          pointerEvents: "none",
          zIndex: -9999,
        }}
      >
        {renderingStudent && (
          <BaseCertificate data={renderingStudent} layout={layoutConfig} passRef={certificateRef} />
        )}
      </div>
    </>
  );
}
