"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { CertificateStudentData } from "@/hooks/useCertificateGenerator";

export type { CertificateStudentData as StudentCertificateData };

interface BaseCertificateProps {
  data: CertificateStudentData;
  passRef?: React.RefObject<HTMLDivElement>;
}

/**
 * Certificate overlay for US Letter Landscape (11 x 8.5 in).
 * Canvas: 2200 x 1700 px (letter landscape at ~200 DPI).
 *
 * ONLY blank-fill values are overlaid — the template background image
 * already contains all printed paragraph text, headings, and signatures.
 */
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

  const gradDate = new Date(data.dateGraduated);
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

  const givenDay = gradDate.getDate();
  const givenMonthYear = gradDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Canvas: 2200 x 1700 = US Letter Landscape ratio (11 : 8.5)
  return (
    <div
      ref={passRef}
      style={{
        width: "2200px",
        height: "1700px",
        position: "relative",
        backgroundColor: "#ffffff",
        backgroundImage: `url('/certificate-bg.jpg')`,
        backgroundSize: "100% 100%",
        overflow: "hidden",
      }}
    >
      {/* ── Student Full Name ──────────────────────────────────
          On the blank underline below "to", above the body paragraph.
          ~37% from top = 629px */}
      <div
        style={{
          position: "absolute",
          top: "630px",
          left: "0",
          width: "2200px",
          textAlign: "center",
          fontSize: "60px",
          fontWeight: "bold",
          fontFamily: "Arial Black, Arial, sans-serif",
          color: "#1a1a1a",
          letterSpacing: "3px",
          lineHeight: 1,
        }}
      >
        {fullName}
      </div>

      {/* ── Start Date ("from ____" blank) ────────────────────
          2nd line of body paragraph. ~54% from top = 918px.
          "from" word ends at ~50% width; blank starts ~51% = 1120px */}
      <div
        style={{
          position: "absolute",
          top: "915px",
          left: "1080px",
          fontSize: "28px",
          fontWeight: "bold",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#111111",
          whiteSpace: "nowrap",
        }}
      >
        {formattedStart}
      </div>

      {/* ── End Date ("to ____" blank) ────────────────────────
          Same line. "to" word ends at ~66%; blank starts ~67% = 1475px */}
      <div
        style={{
          position: "absolute",
          top: "915px",
          left: "1480px",
          fontSize: "28px",
          fontWeight: "bold",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#111111",
          whiteSpace: "nowrap",
        }}
      >
        {formattedEnd}
      </div>

      {/* ── Given Day ("Given this ____ day") ─────────────────
          ~65% from top = 1105px. "Given this" ends ~18% = 396px */}
      <div
        style={{
          position: "absolute",
          top: "1105px",
          left: "385px",
          fontSize: "28px",
          fontWeight: "bold",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#111111",
          whiteSpace: "nowrap",
          textAlign: "center",
          minWidth: "100px",
        }}
      >
        {givenDay}
      </div>

      {/* ── Given Month + Year ("day of ____ at Poblacion") ───
          Same line. "day of" ends ~32% = 704px */}
      <div
        style={{
          position: "absolute",
          top: "1105px",
          left: "700px",
          fontSize: "28px",
          fontWeight: "bold",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#111111",
          whiteSpace: "nowrap",
          textAlign: "center",
          minWidth: "220px",
        }}
      >
        {givenMonthYear}
      </div>

      {/* ── QR Code — bottom-left, above left signatory ─────── */}
      <div
        style={{
          position: "absolute",
          bottom: "200px",
          left: "60px",
          width: "210px",
          height: "210px",
          backgroundColor: "#ffffff",
          padding: "6px",
          borderRadius: "6px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
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
