import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const statusLabels: Record<string, string> = {
  PENDING: "Ожидание",
  PAID: "Оплачен",
  FAILED: "Ошибка",
  REFUNDED: "Возврат",
};

const statusVariants: Record<string, "default" | "success" | "destructive" | "secondary" | "warning" | "outline"> = {
  PENDING: "warning",
  PAID: "success",
  FAILED: "destructive",
  REFUNDED: "secondary",
};

const syncVariants: Record<string, "default" | "success" | "destructive" | "secondary" | "warning" | "outline"> = {
  PENDING: "secondary",
  SUCCESS: "success",
  FAILED: "destructive",
};

const syncLabels: Record<string, string> = {
  PENDING: "Ожидает",
  SUCCESS: "Синхр.",
  FAILED: "Ошибка",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      items: {
        include: { product: { select: { title: true } } },
      },
    },
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Заказы</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Последние {orders.length} заказов
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Все заказы</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8 text-sm">Заказов пока нет</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Покупатель</TableHead>
                  <TableHead>Продукт</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Провайдер</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Синхр.</TableHead>
                  <TableHead>Дата</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="block hover:underline"
                      >
                        <div className="font-medium text-sm">{order.customerName}</div>
                        <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.items[0]?.product.title ?? "—"}
                      {order.items.length > 1 && (
                        <span className="text-xs text-muted-foreground ml-1">
                          +{order.items.length - 1}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {(order.amount / 100).toLocaleString("ru-RU")} {order.currency}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {order.provider}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[order.status] ?? "secondary"}>
                        {statusLabels[order.status] ?? order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={syncVariants[order.syncStatus] ?? "secondary"}>
                        {syncLabels[order.syncStatus] ?? order.syncStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {order.createdAt.toLocaleDateString("ru-RU")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
