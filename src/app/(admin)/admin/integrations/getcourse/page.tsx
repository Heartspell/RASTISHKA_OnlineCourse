import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetCourseConnectionTest } from "@/components/admin/GetCourseConnectionTest";

export default async function GetCourseIntegrationPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const hasConfig = !!(process.env.GETCOURSE_ACCOUNT && process.env.GETCOURSE_API_KEY);
  const account = process.env.GETCOURSE_ACCOUNT ?? "";

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Интеграция GetCourse</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Настройки синхронизации с GetCourse
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Конфигурация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-muted-foreground">Аккаунт</div>
            <div className="font-medium">
              {account ? (
                <span className="font-mono">{account}.getcourse.ru</span>
              ) : (
                <span className="text-destructive">Не настроен</span>
              )}
            </div>
            <div className="text-muted-foreground">API-ключ</div>
            <div className="font-medium">
              {process.env.GETCOURSE_API_KEY ? (
                <span className="font-mono">
                  {process.env.GETCOURSE_API_KEY.slice(0, 4)}•••••••••••
                </span>
              ) : (
                <span className="text-destructive">Не настроен</span>
              )}
            </div>
          </div>

          {!hasConfig && (
            <div className="rounded-md bg-warning/10 px-4 py-3 text-sm text-warning-foreground border border-warning/20">
              Заполните переменные{" "}
              <code className="font-mono text-xs">GETCOURSE_ACCOUNT</code> и{" "}
              <code className="font-mono text-xs">GETCOURSE_API_KEY</code> в файле{" "}
              <code className="font-mono text-xs">.env</code>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Секреты хранятся в <code className="font-mono">.env</code> на сервере и не отображаются
            полностью в целях безопасности.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Проверка соединения</CardTitle>
        </CardHeader>
        <CardContent>
          <GetCourseConnectionTest hasConfig={hasConfig} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Как настроить</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm text-sm text-muted-foreground space-y-2 max-w-none">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Откройте ваш аккаунт GetCourse → Настройки → API
            </li>
            <li>
              Скопируйте API-ключ и subdomain (часть адреса до <code>.getcourse.ru</code>)
            </li>
            <li>
              Добавьте в файл <code>.env</code>:
              <pre className="bg-muted rounded p-2 mt-1 text-xs font-mono">
{`GETCOURSE_ACCOUNT=your-subdomain
GETCOURSE_API_KEY=your-api-key`}
              </pre>
            </li>
            <li>
              Для каждого продукта/тарифа укажите{" "}
              <strong>«Группу в GetCourse»</strong> — точное название группы/тренинга в вашем
              аккаунте.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
