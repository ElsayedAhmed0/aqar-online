export function compressImage(
  file: File,
  maxWidth = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// ✅ رفع الصورة على Cloudinary (مع إعادة محاولة تلقائية لو حصل تايم آوت)
export async function uploadToCloudinary(file: File, retries = 1): Promise<string> {
  const base64 = await compressImage(file, 1200, 0.82);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      const data = await res.json();
      if (data.url) return data.url;

      if (attempt === retries) throw new Error(data.details || "Upload failed");
    } catch (err) {
      if (attempt === retries) throw err;
    }
  }

  throw new Error("Upload failed");
}