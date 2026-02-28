"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { CertificateStudentData } from "@/hooks/useCertificateGenerator";

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
          top: "830px",
          left: "0",
          width: "2200px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: "60px",
          fontWeight: "bold",
          fontFamily: `"Monotype Corsiva", cursive, Georgia, serif`,
          color: "#1a1a1a",
          letterSpacing: "3px",
          lineHeight: 1,
        }}
      >
        {fullName}
      </div>

      {/* Start Date */}
      <div
        style={{
          position: "absolute",
          top: "1050px",
          left: "1175px",
          fontSize: "33px",
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
          top: "1050px",
          left: "1560px",
          fontSize: "33px",
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
          top: "1240px",
          left: "680px",
          fontSize: "35px",
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
          top: "1240px",
          left: "1070px",
          fontSize: "35px",
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

      {/* QR Code */}
      <div
        style={{
          position: "absolute",
          bottom: "70px",
          left: "70px",
          width: "290px",
          height: "290px",
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
            style={{ width: "290px", height: "290px" }}
          />
        ) : (
          <div
            style={{
              width: "290px",
              height: "290px",
              backgroundColor: "#f1f5f9",
            }}
          />
        )}
      </div>

      {/* QR Legitimacy Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: "25px",
          left: "65px",
          width: "302px", // 290px + 12px padding
          textAlign: "center",
          fontSize: "22px",
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
