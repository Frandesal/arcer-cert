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
 * Renders the certificate template with data overlaid ONLY in the blank spaces.
 * The template background already contains all the paragraph text, so we only
 * need to position our data values over the existing blank underlines.
 *
 * Canvas: 2000 x 1414 px (landscape)
 *
 * Overlay targets (approximate pixel positions on the 2000x1414 canvas):
 *  - Student name  : top ~740px, horizontally centered
 *  - Start date    : top ~708px, left ~490px  (fills "from ___" blank)
 *  - End date      : top ~708px, left ~910px  (fills "to ___" blank)
 *  - Given day     : top ~940px, left ~288px  (fills "Given this ___")
 *  - Given month/yr: top ~940px, left ~600px  (fills "day of ___")
 *  - QR Code       : bottom-left, above signatory area
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

  // "Given this" line: day number + Month Year
  const givenDay = gradDate.getDate();
  const givenMonthYear = gradDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
        overflow: "hidden",
      }}
    >
      {/* ── Student Full Name ─────────────────────────────────────────────────
          Placed on the blank underline below the "to" text.
          The ribbon banner centre is ~430px; the blank line sits ~520-540px. */}
      <div
        style={{
          position: "absolute",
          top: "510px",
          left: "0",
          width: "2000px",
          textAlign: "center",
          fontSize: "62px",
          fontWeight: "bold",
          fontFamily: "Arial Black, Arial, sans-serif",
          color: "#1a1a1a",
          letterSpacing: "3px",
          lineHeight: 1,
        }}
      >
        {fullName}
      </div>

      {/* ── Start Date (fills "from ____" blank in the body paragraph) ─────── */}
      <div
        style={{
          position: "absolute",
          top: "702px",
          left: "490px",
          fontSize: "30px",
          fontWeight: "bold",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#111111",
          whiteSpace: "nowrap",
        }}
      >
        {formattedStart}
      </div>

      {/* ── End Date (fills "to ____" blank in the body paragraph) ──────────── */}
      <div
        style={{
          position: "absolute",
          top: "702px",
          left: "990px",
          fontSize: "30px",
          fontWeight: "bold",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#111111",
          whiteSpace: "nowrap",
        }}
      >
        {formattedEnd}
      </div>

      {/* ── "Given this" Day number ───────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "930px",
          left: "300px",
          fontSize: "30px",
          fontWeight: "bold",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#111111",
          whiteSpace: "nowrap",
        }}
      >
        {givenDay}
      </div>

      {/* ── "Given this" Month + Year ─────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "930px",
          left: "600px",
          fontSize: "30px",
          fontWeight: "bold",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#111111",
          whiteSpace: "nowrap",
        }}
      >
        {givenMonthYear}
      </div>

      {/* ── QR Code — bottom-left, above left signatory ───────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "140px",
          left: "55px",
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
