"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { CertificateStudentData } from "@/hooks/useCertificateGenerator";

import { CertificateLayoutConfig, defaultCertificateLayout } from "@/types/certificate";

export type { CertificateStudentData as StudentCertificateData };

interface BaseCertificateProps {
  data: CertificateStudentData;
  layout?: CertificateLayoutConfig;
  passRef?: React.RefObject<HTMLDivElement>;
}

export function BaseCertificate({ data, layout, passRef }: BaseCertificateProps) {
  const config = layout || defaultCertificateLayout;
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

  const getOrdinalSuffix = (i: number) => {
    const j = i % 10, k = i % 100;
    if (j === 1 && k !== 11) return i + "st";
    if (j === 2 && k !== 12) return i + "nd";
    if (j === 3 && k !== 13) return i + "rd";
    return i + "th";
  };

  const givenDay = getOrdinalSuffix(gradDate.getDate());
  const givenMonthYear = gradDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
      {/* Student Name */}
      <div
        style={{
          position: "absolute",
          top: config.name.top,
          left: config.name.left || "0",
          width: "2200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: config.name.fontSize,
          fontWeight: "bold",
          fontFamily: `"Monotype Corsiva", cursive, Georgia, serif`,
          textTransform: "capitalize",
          color: "#1a1a1a",
          letterSpacing: "3px",
          lineHeight: 1,
        }}
      >
        {fullName.toLowerCase()}
      </div>

      {/* Start Date */}
      <div
        style={{
          position: "absolute",
          top: config.startDate.top,
          left: config.startDate.left,
          fontSize: config.startDate.fontSize,
          fontWeight: "bold",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#111111",
          whiteSpace: "nowrap",
        }}
      >
        {formattedStart}
      </div>

      {/* End Date */}
      <div
        style={{
          position: "absolute",
          top: config.endDate.top,
          left: config.endDate.left,
          fontSize: config.endDate.fontSize,
          fontWeight: "bold",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#111111",
          whiteSpace: "nowrap",
        }}
      >
        {formattedEnd}
      </div>

      {/* Given Day */}
      <div
        style={{
          position: "absolute",
          top: config.givenDay.top,
          left: config.givenDay.left,
          fontSize: config.givenDay.fontSize,
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

      {/* Given Month+Year */}
      <div
        style={{
          position: "absolute",
          top: config.givenMonthYear.top,
          left: config.givenMonthYear.left,
          fontSize: config.givenMonthYear.fontSize,
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

      {/* Hours */}
      {(data.hours ?? 120) > 0 && (
        <div
          style={{
            position: "absolute",
            top: config.hours.top,
            left: config.hours.left,
            fontSize: config.hours.fontSize,
            fontWeight: "bold",
            fontStyle: "italic",
            fontFamily: "Georgia, serif",
            color: "#111111",
            whiteSpace: "nowrap",
          }}
        >
          {data.hours ?? 120} Hours
        </div>
      )}


      {/* QR Code */}
      <div
        style={{
          position: "absolute",
          bottom: config.qrCode.bottom,
          left: config.qrCode.left,
          width: config.qrCode.size,
          height: config.qrCode.size,
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
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#f1f5f9",
            }}
          />
        )}
      </div>

      {/* QR Legitimacy Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: config.qrCode.textBottom,
          left: config.qrCode.left, // Match QR code left
          width: config.qrCode.size, // Match QR code width for text centering
          textAlign: "center",
          fontSize: config.qrCode.textFontSize,
          fontWeight: "bold",
          fontFamily: "Arial, sans-serif",
          color: "#ffffffff",
          letterSpacing: "1px",
        }}
      >
        SCAN TO VERIFY
      </div>
    </div>
  );
}
