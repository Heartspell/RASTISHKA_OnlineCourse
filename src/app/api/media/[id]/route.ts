import { db } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const media = await db.mediaFile.findUnique({
    where: { id },
  });

  if (!media) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(media.data, {
    headers: {
      "Content-Type": media.mimeType,
      "Content-Length": String(media.size),
      // Cache 1 year — files are immutable (new upload = new ID)
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": `inline; filename="${media.filename}"`,
    },
  });
}
