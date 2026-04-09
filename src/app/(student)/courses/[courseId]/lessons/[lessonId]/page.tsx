import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LessonPlayer } from "@/components/courses/LessonPlayer";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { courseId, lessonId } = await params;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId },
    },
  });

  if (!enrollment) redirect("/dashboard");

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: { select: { title: true } } },
  });

  if (!lesson || lesson.courseId !== courseId) redirect(`/courses/${courseId}`);

  const progress = await prisma.progress.findUnique({
    where: {
      userId_lessonId: { userId: session.user.id, lessonId },
    },
  });

  const allLessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    select: { id: true, title: true, order: true },
  });

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const nextLesson = allLessons[currentIndex + 1];
  const prevLesson = allLessons[currentIndex - 1];

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Link
        href={`/courses/${courseId}`}
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        &larr; {lesson.course.title}
      </Link>

      <h1 className="text-2xl font-bold mb-2">{lesson.title}</h1>

      {lesson.videoUrl && (
        <div className="aspect-video rounded-lg overflow-hidden bg-black mb-6">
          <iframe
            src={lesson.videoUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {lesson.description && (
        <p className="text-muted-foreground mb-6">{lesson.description}</p>
      )}

      <LessonPlayer
        lessonId={lessonId}
        completed={progress?.completed ?? false}
      />

      <div className="flex justify-between mt-8">
        {prevLesson ? (
          <Link
            href={`/courses/${courseId}/lessons/${prevLesson.id}`}
            className="text-sm text-primary hover:underline"
          >
            &larr; {prevLesson.title}
          </Link>
        ) : (
          <span />
        )}
        {nextLesson && (
          <Link
            href={`/courses/${courseId}/lessons/${nextLesson.id}`}
            className="text-sm text-primary hover:underline"
          >
            {nextLesson.title} &rarr;
          </Link>
        )}
      </div>
    </div>
  );
}
