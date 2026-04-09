import { prisma } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: {
      _count: { select: { lessons: true } },
    },
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Каталог курсов</h1>

      {courses.length === 0 ? (
        <p className="text-muted-foreground">
          Курсы пока не добавлены. Загляните позже!
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/catalog/${course.id}`}
              className="group rounded-lg border p-6 hover:border-primary transition-colors"
            >
              {course.thumbnailUrl && (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {course.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {course.description}
              </p>
              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-muted-foreground">
                  {course._count.lessons} уроков
                </span>
                {course.price > 0 ? (
                  <span className="font-semibold">
                    {course.price} {course.currency}
                  </span>
                ) : (
                  <span className="text-green-600 font-semibold">
                    Бесплатно
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
