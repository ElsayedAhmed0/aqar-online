import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });
cloudinary.config({
  cloud_name: "de6itr3fm",
  api_key: "737929629931548",
  api_secret: "9wDR7ZIZy5vNE4BzCGeXZvVnSzI",
});

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    const result = await cloudinary.uploader.upload(image, {
      folder: "aqar-online",
      transformation: [
        { width: 1200, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({
      error: "Upload failed",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}