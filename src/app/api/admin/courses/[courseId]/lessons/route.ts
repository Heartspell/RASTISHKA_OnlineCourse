import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { courseId } = await params;
  const data = await req.json();

  const lastLesson = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { order: "desc" },
  });

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title: data.title,
      description: data.description || null,
      videoUrl: data.videoUrl || null,
      isFree: data.isFree || false,
      order: (lastLesson?.order ?? -1) + 1,
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}
