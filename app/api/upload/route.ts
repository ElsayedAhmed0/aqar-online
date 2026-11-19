import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export const runtime = "nodejs";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const MAX_BYTES = 6 * 1024 * 1024; // 6MB بعد الضغط

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (typeof image !== "string") {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }

    // الصيغة المتوقعة: data:image/jpeg;base64,xxxx
    const match = image.match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "Unsupported image format" }, { status: 400 });
    }

    const contentType = match[1];
    const buffer = Buffer.from(match[2], "base64");

    if (buffer.length > MAX_BYTES) {
      return NextResponse.json({ error: "Image too large" }, { status: 413 });
    }

    const ext = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
    const name = randomBytes(12).toString("hex");
    const key = `aqar-online/${name}.${ext}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    const base = process.env.NEXT_PUBLIC_IMAGES_URL || "";
    return NextResponse.json({ url: `${base}/${key}` });
  } catch (error) {
    console.error("R2 upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}