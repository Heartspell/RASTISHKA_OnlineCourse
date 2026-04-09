import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: {
      course: {
        include: {
          lessons: { select: { id: true } },
        },
      },
    },
  });

  const progressCounts = await prisma.progress.groupBy({
    by: ["lessonId"],
    where: {
      userId: session.user.id,
      completed: true,
    },
  });
  const completedLessonIds = new Set(progressCounts.map((p) => p.lessonId));

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Мои курсы</h1>
      <p className="text-muted-foreground mb-8">
        Добро пожаловать, {session.user.name}!
      </p>

      {enrollments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">
            У вас пока нет записей на курсы
          </p>
          <Link
            href="/catalog"
            className="text-primary hover:underline font-medium"
          >
            Посмотреть каталог курсов
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map(({ course }) => {
            const totalLessons = course.lessons.length;
            const completedLessons = course.lessons.filter((l) =>
              completedLessonIds.has(l.id)
            ).length;
            const progressPercent =
              totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0;

            return (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="rounded-lg border p-6 hover:border-primary transition-colors"
              >
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {course.description}
                </p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Прогресс</span>
                    <span>
                      {completedLessons}/{totalLessons}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2 transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
