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
    const generateQR = async () => {
      try {
        const url = `${window.location.origin}/verify/${data.id}`;
        const qrUrl = await QRCode.toDataURL(url, {
          width: 320,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
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
    .join(" ")
    .toUpperCase();

  // Parse graduation date for the "Given this" line
  const gradDate = new Date(data.dateGraduated);
  const givenDay = gradDate.getDate();
  const givenMonthYear = gradDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Format the from/to dates for the body paragraph
  const startDate = new Date(data.dateEntered ?? data.dateGraduated);
  const formattedStart = startDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formattedEnd = gradDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Canvas: 2000 x 1414 px (landscape standard)
  return (
    <div
      ref={passRef}
      style={{
        width: "2000px",
        height: "1414px",
        position: "relative",
        backgroundColor: "#ffffff",
        backgroundImage: `url('/certificate-bg.jpg')`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        fontFamily: "Georgia, 'Times New Roman', serif",
        overflow: "hidden",
      }}
    >
      {/* ── Student Full Name ──────────────────────────────────────────────── */}
      {/* Positioned below the ribbon banner under "to", centered */}
      <div
        style={{
          position: "absolute",
          top: "490px",
          left: "200px",
          right: "200px",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#000000",
            letterSpacing: "2px",
            fontFamily: "Georgia, serif",
          }}
        >
          {fullName}
        </span>
        {/* Underline matching template */}
        <div
          style={{
            borderBottom: "2px solid #000000",
            marginTop: "4px",
            marginLeft: "40px",
            marginRight: "40px",
          }}
        />
      </div>

      {/* ── Body Paragraph (from / to dates) ─────────────────────────────── */}
      {/* "Has satisfactorily completed ... from [start] to [end] at Arcer..." */}
      <div
        style={{
          position: "absolute",
          top: "640px",
          left: "130px",
          right: "130px",
          textAlign: "center",
          fontSize: "34px",
          fontStyle: "italic",
          color: "#000000",
          lineHeight: "1.6",
          fontFamily: "Georgia, serif",
        }}
      >
        Has satisfactorily completed the{" "}
        <span style={{ textDecoration: "underline", fontWeight: "bold" }}>
          120 hours
        </span>{" "}
        Computer Literacy Training of Corel Draw,
        <br />
        Adobe Photoshop and Microsoft Office{" "}
        <span style={{ fontWeight: "bold" }}>from{" "}
          <span style={{ textDecoration: "underline" }}>{formattedStart}</span>
          {" "}to{" "}
          <span style={{ textDecoration: "underline" }}>{formattedEnd}</span>
        </span>{" "}
        at Arcer
        <br />
        Computer Educational Development System Inc.
      </div>

      {/* ── "Given this" line ────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "920px",
          left: "130px",
          fontSize: "34px",
          fontStyle: "italic",
          color: "#000000",
          fontFamily: "Georgia, serif",
          whiteSpace: "nowrap",
        }}
      >
        Given this{" "}
        <span
          style={{
            display: "inline-block",
            borderBottom: "2px solid #000",
            minWidth: "90px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {givenDay}
        </span>{" "}
        day of{" "}
        <span
          style={{
            display: "inline-block",
            borderBottom: "2px solid #000",
            minWidth: "220px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {givenMonthYear}
        </span>{" "}
        at Poblacion Buug, ZSP.
      </div>

      {/* ── QR Code ─────────────────────────────────────────────────────── */}
      {/* Bottom-left, above the left signatory area */}
      <div
        style={{
          position: "absolute",
          bottom: "155px",
          left: "60px",
          width: "200px",
          height: "200px",
          backgroundColor: "#ffffff",
          padding: "8px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {qrCodeDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={qrCodeDataUrl}
            alt="Verification QR Code"
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", backgroundColor: "#f1f5f9" }} />
        )}
      </div>
    </div>
  );
}
