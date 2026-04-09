import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalUsers, totalCourses, totalEnrollments] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Админ-панель</h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Пользователи</p>
          <p className="text-3xl font-bold mt-1">{totalUsers}</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Курсы</p>
          <p className="text-3xl font-bold mt-1">{totalCourses}</p>
        </div>
        <div className="rounded-lg border p-6">
          <p className="text-sm text-muted-foreground">Записи на курсы</p>
          <p className="text-3xl font-bold mt-1">{totalEnrollments}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Последние регистрации</h2>
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left p-3 font-medium">Имя</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium">Роль</th>
                <th className="text-left p-3 font-medium">Дата</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3 text-muted-foreground">{user.email}</td>
                  <td className="p-3">
                    <span
                      className={
                        user.role === "ADMIN"
                          ? "text-primary font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {user.role === "ADMIN" ? "Админ" : "Ученик"}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {user.createdAt.toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
