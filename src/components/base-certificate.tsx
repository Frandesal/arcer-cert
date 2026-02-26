"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { CertificateStudentData } from "@/hooks/useCertificateGenerator";

// Re-export so consumers don't need to import from the hook directly
export type { CertificateStudentData as StudentCertificateData };

interface BaseCertificateProps {
  data: CertificateStudentData;
  passRef?: React.RefObject<HTMLDivElement>;
}

export function BaseCertificate({ data, passRef }: BaseCertificateProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  useEffect(() => {
    // Generate the QR Code pointing to the public verification page
    const generateQR = async () => {
      try {
        const url = `${window.location.origin}/verify/${data.id}`;
        const qrUrl = await QRCode.toDataURL(url, {
          width: 300,
          margin: 1,
          color: {
            dark: "#0f172a", // slate-900
            light: "#ffffff",
          },
        });
        setQrCodeDataUrl(qrUrl);
      } catch (err) {
        console.error("Failed to generate QR code", err);
      }
    };
    generateQR();
  }, [data.id]);

  const fullName = [data.firstName, data.middleName, data.lastName]
    .filter(Boolean)
    .join(" ");

  const formattedDate = new Date(data.dateGraduated).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      ref={passRef}
      // Fixed pixel sizes guarantee high-resolution A4/Letter rendering. 
      // 2000x1414 is roughly standard landscape certificate aspect ratio
      style={{
        width: "2000px",
        height: "1414px",
        position: "relative",
        backgroundColor: "#ffffff",
        backgroundImage: `url('/certificate-bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        color: "#0f172a",
        overflow: "hidden",
      }}
    >
      {/* Graduate Name Overlay */}
      <div
        style={{
          position: "absolute",
          top: "45%", // Adjust these positioning percentages based on the actual PNG template
          left: "0",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "100px", fontWeight: "bold", margin: 0, color: "#064e3b" }}>
          {fullName}
        </h1>
        <p style={{ fontSize: "36px", marginTop: "20px", color: "#475569" }}>
          Has successfully completed the tech modules below on {formattedDate}.
        </p>
      </div>

      {/* Modules Overlay */}
      <div
        style={{
          position: "absolute",
          top: "65%",
          left: "15%",
          right: "40%", // Leave space on the right for the signature/QR
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {data.modulesCompleted?.map((mod, idx) => (
          <div
            key={idx}
            style={{
              padding: "15px 30px",
              backgroundColor: "rgba(16, 185, 129, 0.1)", // emerald-500/10
              border: "3px solid #10b981",
              borderRadius: "50px",
              fontSize: "28px",
              fontWeight: "600",
              color: "#064e3b",
            }}
          >
            {mod.title} ({mod.count})
          </div>
        ))}
      </div>

      {/* QR Code Overlay */}
      <div
        style={{
          position: "absolute",
          bottom: "120px",
          right: "150px",
          width: "250px",
          height: "250px",
          padding: "15px",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        }}
      >
        {qrCodeDataUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={qrCodeDataUrl} alt="Verification QR Code" style={{ width: "100%", height: "100%" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", backgroundColor: "#f1f5f9" }} />
        )}
        <p style={{ textAlign: "center", marginTop: "10px", fontSize: "16px", color: "#64748b", fontWeight: "bold" }}>
          SCAN TO VERIFY
        </p>
      </div>
      
      {/* Verification Link Text */}
      <div style={{
          position: "absolute",
          bottom: "40px",
          width: "100%",
          textAlign: "center",
          fontSize: "24px",
          color: "#94a3b8"
      }}>
         Verify authenticity at: {window.location.origin}/verify/{data.id}
      </div>
    </div>
  );
}
