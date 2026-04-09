import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Онлайн-курсы детского массажа
        </h1>
        <p className="text-lg text-muted-foreground">
          Профессиональные курсы массажа для детей от инклюзивного садика
          &laquo;Растишка&raquo;. Учитесь в удобном темпе, получайте
          практические навыки.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/catalog">
            <Button size="lg">Смотреть курсы</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">
              Регистрация
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
