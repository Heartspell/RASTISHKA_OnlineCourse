import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { lessons: true, enrollments: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Курсы</h1>
        <Link href="/admin/courses/new">
          <Button>Добавить курс</Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <p className="text-muted-foreground">Курсов пока нет</p>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Название</th>
                <th className="text-left p-3 font-medium">Уроки</th>
                <th className="text-left p-3 font-medium">Записи</th>
                <th className="text-left p-3 font-medium">Цена</th>
                <th className="text-left p-3 font-medium">Статус</th>
                <th className="text-left p-3 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{course.title}</td>
                  <td className="p-3 text-muted-foreground">
                    {course._count.lessons}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {course._count.enrollments}
                  </td>
                  <td className="p-3">
                    {course.price > 0
                      ? `${course.price} ${course.currency}`
                      : "Бесплатно"}
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        course.isPublished
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }
                    >
                      {course.isPublished ? "Опубликован" : "Черновик"}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/admin/courses/${course.id}/edit`}
                      className="text-primary hover:underline"
                    >
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
