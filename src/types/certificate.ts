export interface TextOverlayConfig {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  fontSize: string;
}

export interface QRCodeConfig {
  bottom: string;
  left: string;
  size: string;
  textBottom: string;
  textFontSize: string;
}

export interface CertificateLayoutConfig {
  name: TextOverlayConfig;
  startDate: TextOverlayConfig;
  endDate: TextOverlayConfig;
  givenDay: TextOverlayConfig;
  givenMonthYear: TextOverlayConfig;
  hours: TextOverlayConfig;
  qrCode: QRCodeConfig;
}

export const defaultCertificateLayout: CertificateLayoutConfig = {
  name: { top: "830px", left: "0px", fontSize: "60px" },
  startDate: { top: "1050px", left: "1175px", fontSize: "33px" },
  endDate: { top: "1050px", left: "1560px", fontSize: "33px" },
  givenDay: { top: "1240px", left: "680px", fontSize: "35px" },
  givenMonthYear: { top: "1240px", left: "1070px", fontSize: "35px" },
  hours: { top: "1400px", left: "1100px", fontSize: "30px" },
  qrCode: { bottom: "70px", left: "70px", size: "290px", textBottom: "35px", textFontSize: "22px" }
};
