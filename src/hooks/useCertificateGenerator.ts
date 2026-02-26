"use client";

import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";

export interface CertificateStudentData {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateEntered?: string;
  dateGraduated: string;
  modulesCompleted: { title: string; count: number }[];
}

// Re-export for backwards compatibility with BaseCertificate
export type { CertificateStudentData as StudentCertificateData };

/**
 * A shared hook that manages the off-screen certificate rendering pipeline.
 * Renders certificates as PNG images via html-to-image, then stitches them
 * into a print-ready landscape PDF using jsPDF.
 *
 * Usage: Mount <BaseCertificate data={renderingStudent} passRef={certificateRef} />
 * off-screen in the component tree for the snapshot to work.
 */
export function useCertificateGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStatus, setGeneratingStatus] = useState("");
  const [renderingStudent, setRenderingStudent] =
    useState<CertificateStudentData | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  const snapCertificate = useCallback(async (): Promise<string | null> => {
    if (!certificateRef.current) return null;
    try {
      const dataUrl = await toPng(certificateRef.current, {
        pixelRatio: 1,
        cacheBust: true,
      });
      return dataUrl;
    } catch (err) {
      console.error("Failed to snapshot certificate", err);
      return null;
    }
  }, []);

  /**
   * Render and download a single student's certificate as a single-page PDF.
   */
  const downloadSingleCertificate = useCallback(
    async (student: CertificateStudentData) => {
      setIsGenerating(true);
      setGeneratingStatus(`Rendering certificate for ${student.firstName}...`);

      await new Promise<void>((resolve) => {
        setRenderingStudent(student);
        setTimeout(resolve, 500);
      });

      const dataUrl = await snapCertificate();

      if (dataUrl) {
        setGeneratingStatus("Building PDF...");
        // Dynamically import jspdf to keep bundle size manageable
        const { jsPDF } = await import("jspdf");
        // A4 landscape: 297mm x 210mm
        const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
        pdf.addImage(dataUrl, "PNG", 0, 0, 297, 210);
        const fileName = `${student.firstName}_${student.lastName}_Certificate.pdf`.replace(/\s+/g, "_");
        pdf.save(fileName);
      }

      setRenderingStudent(null);
      setIsGenerating(false);
      setGeneratingStatus("");
    },
    [snapCertificate]
  );

  /**
   * Generate certificates for a batch of students and download a single multi-page PDF.
   * Each student gets their own page — perfectly print-ready.
   */
  const downloadBatchCertificates = useCallback(
    async (students: CertificateStudentData[], pdfFileName?: string) => {
      setIsGenerating(true);

      // Dynamically import jspdf
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        setGeneratingStatus(
          `Rendering certificate ${i + 1} of ${students.length} — ${student.firstName} ${student.lastName}...`
        );

        await new Promise<void>((resolve) => {
          setRenderingStudent(student);
          setTimeout(resolve, 500);
        });

        const dataUrl = await snapCertificate();
        if (dataUrl) {
          if (i > 0) pdf.addPage();
          pdf.addImage(dataUrl, "PNG", 0, 0, 297, 210);
        }
      }

      setGeneratingStatus("Saving PDF...");
      const finalFileName =
        pdfFileName ||
        `Arcer_Certificates_${new Date().toISOString().split("T")[0]}.pdf`;
      pdf.save(finalFileName);

      setRenderingStudent(null);
      setIsGenerating(false);
      setGeneratingStatus("");
    },
    [snapCertificate]
  );

  return {
    isGenerating,
    generatingStatus,
    renderingStudent,
    certificateRef,
    downloadSingleCertificate,
    downloadBatchCertificates,
  };
}
