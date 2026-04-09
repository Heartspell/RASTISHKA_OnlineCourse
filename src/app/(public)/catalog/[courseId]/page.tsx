import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId, isPublished: true },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, duration: true, isFree: true },
      },
    },
  });

  if (!course) notFound();

  const totalDuration = course.lessons.reduce((sum, l) => sum + l.duration, 0);

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link
        href="/catalog"
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        &larr; Каталог
      </Link>

      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

      <div className="flex gap-4 text-sm text-muted-foreground mb-6">
        <span>{course.lessons.length} уроков</span>
        {totalDuration > 0 && (
          <span>{Math.ceil(totalDuration / 60)} мин</span>
        )}
        {course.price > 0 ? (
          <span className="font-semibold text-foreground">
            {course.price} {course.currency}
          </span>
        ) : (
          <span className="text-green-600 font-semibold">Бесплатно</span>
        )}
      </div>

      <p className="text-muted-foreground mb-8">{course.description}</p>

      <div className="mb-8">
        <Link href="/register">
          <Button size="lg">Записаться на курс</Button>
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-4">Программа курса</h2>
      <div className="space-y-2">
        {course.lessons.map((lesson, i) => (
          <div
            key={lesson.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium text-muted-foreground">
                {i + 1}
              </span>
              <span className="font-medium">{lesson.title}</span>
              {lesson.isFree && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  Бесплатно
                </span>
              )}
            </div>
            {lesson.duration > 0 && (
              <span className="text-sm text-muted-foreground">
                {Math.ceil(lesson.duration / 60)} мин
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
