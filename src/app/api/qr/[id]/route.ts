import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import QRCode from "qrcode";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing student ID" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: student, error } = await supabase
    .from("students")
    .select("id")
    .eq("id", id)
    .single();

  if (error || !student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_VERIFY_BASE_URL || "";
  const verifyUrl = `${baseUrl}/verify/${id}`;

  const pngBuffer = await QRCode.toBuffer(verifyUrl, {
    width: 512,
    margin: 4,
    color: { dark: "#052e16", light: "#ffffff" },
    type: "png",
  });

  return new NextResponse(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="arcer-certificate-${id}.png"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
