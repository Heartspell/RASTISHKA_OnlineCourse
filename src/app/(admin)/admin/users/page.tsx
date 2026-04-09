import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true } },
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Пользователи</h1>

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Имя</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Телефон</th>
              <th className="text-left p-3 font-medium">Роль</th>
              <th className="text-left p-3 font-medium">Курсы</th>
              <th className="text-left p-3 font-medium">Дата регистрации</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3 text-muted-foreground">{user.email}</td>
                <td className="p-3 text-muted-foreground">
                  {user.phone || "—"}
                </td>
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
                  {user._count.enrollments}
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
  );
}
