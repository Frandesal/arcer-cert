"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  url: string;
  size?: number;
};

export function QRCodeDisplay({ url, size = 200 }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(url, {
        width: size,
        margin: 2,
        color: { dark: "#052e16", light: "#ffffff" },
      }).then(setDataUrl);
    });
  }, [url, size]);

  if (!dataUrl) {
    return (
      <div
        className="animate-pulse bg-muted"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <Image
      src={dataUrl}
      alt="Certificate verification QR code"
      width={size}
      height={size}
      unoptimized
      className="rounded border"
    />
  );
}
