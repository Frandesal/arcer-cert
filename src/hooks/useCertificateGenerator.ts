"use client";

import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export interface CertificateStudentData {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateGraduated: string;
  modulesCompleted: { title: string; count: number }[];
}

// Re-export for backwards compatibility with BaseCertificate
export type { CertificateStudentData as StudentCertificateData };

/**
 * A shared hook that manages the off-screen certificate rendering pipeline.
 * It can render a certificate for a single student (downloading a PNG),
 * or loop through a batch and download a ZIP.
 *
 * Usage: The hook returns a `renderingStudent` state and a `certificateRef`.
 * You must mount `<BaseCertificate data={renderingStudent} passRef={certificateRef} />`
 * somewhere in the component tree (off-screen) for this hook to work.
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
   * Generate and immediately download a single student's certificate as a PNG.
   */
  const downloadSingleCertificate = useCallback(
    async (student: CertificateStudentData) => {
      setIsGenerating(true);
      setGeneratingStatus(`Rendering certificate for ${student.firstName}...`);

      await new Promise<void>((resolve) => {
        setRenderingStudent(student);
        // Give React enough time to paint the hidden DOM element
        setTimeout(resolve, 400);
      });

      const dataUrl = await snapCertificate();
      if (dataUrl) {
        const fileName = `${student.firstName}_${student.lastName}_Certificate.png`.replace(
          /\s+/g,
          "_"
        );
        saveAs(dataUrl, fileName);
      }

      setRenderingStudent(null);
      setIsGenerating(false);
      setGeneratingStatus("");
    },
    [snapCertificate]
  );

  /**
   * Generate certificates for a batch of students and download a ZIP.
   */
  const downloadBatchCertificates = useCallback(
    async (
      students: CertificateStudentData[],
      zipFileName?: string
    ) => {
      setIsGenerating(true);
      const zip = new JSZip();

      for (let i = 0; i < students.length; i++) {
        const student = students[i];
        setGeneratingStatus(
          `Rendering certificate ${i + 1} of ${students.length} (${student.firstName} ${student.lastName})...`
        );

        await new Promise<void>((resolve) => {
          setRenderingStudent(student);
          setTimeout(resolve, 400);
        });

        const dataUrl = await snapCertificate();
        if (dataUrl) {
          const base64Data = dataUrl.split(",")[1];
          const fileName = `${student.firstName}_${student.lastName}_Certificate.png`.replace(
            /\s+/g,
            "_"
          );
          zip.file(fileName, base64Data, { base64: true });
        }
      }

      setGeneratingStatus("Packaging ZIP file...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const finalFileName =
        zipFileName ||
        `Arcer_Graduates_${new Date().toISOString().split("T")[0]}.zip`;
      saveAs(zipBlob, finalFileName);

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
