import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { courseId } = await params;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId },
    },
  });

  if (!enrollment) {
    redirect("/dashboard");
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { orderBy: { order: "asc" } },
    },
  });

  if (!course) redirect("/dashboard");

  const progress = await prisma.progress.findMany({
    where: { userId: session.user.id },
    select: { lessonId: true, completed: true },
  });
  const completedSet = new Set(
    progress.filter((p) => p.completed).map((p) => p.lessonId)
  );

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <Link
        href="/dashboard"
        className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
      >
        &larr; Мои курсы
      </Link>

      <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
      <p className="text-muted-foreground mb-8">{course.description}</p>

      <div className="space-y-2">
        {course.lessons.map((lesson, i) => (
          <Link
            key={lesson.id}
            href={`/courses/${courseId}/lessons/${lesson.id}`}
            className="flex items-center justify-between rounded-lg border p-4 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  completedSet.has(lesson.id)
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {completedSet.has(lesson.id) ? "\u2713" : i + 1}
              </span>
              <span className="font-medium">{lesson.title}</span>
            </div>
            {lesson.duration > 0 && (
              <span className="text-sm text-muted-foreground">
                {Math.ceil(lesson.duration / 60)} мин
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
