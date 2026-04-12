import Link from "next/link";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TariffCardProps {
  id: string;
  productSlug: string;
  name: string;
  tagline?: string | null;
  priceKgs: number;
  priceUsd: number;
  durationLabel: string;
  includes: string[];
  isFeatured?: boolean;
}

export function TariffCard({
  id,
  productSlug,
  name,
  tagline,
  priceKgs,
  priceUsd,
  durationLabel,
  includes,
  isFeatured,
}: TariffCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-shadow",
        isFeatured
          ? "border-primary shadow-lg shadow-primary/10 bg-gradient-to-b from-primary/5 to-white"
          : "border-border bg-white hover:shadow-md"
      )}
    >
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
            <Star className="h-3 w-3 fill-white" />
            Популярный
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-xl font-bold text-foreground">{name}</h3>
        {tagline && <p className="text-sm text-muted-foreground mt-1">{tagline}</p>}
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">
            {priceKgs.toLocaleString("ru-RU")} с
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-muted-foreground">${priceUsd}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">Доступ {durationLabel}</span>
        </div>
      </div>

      {/* Includes list */}
      <ul className="space-y-2 flex-1 mb-6">
        {includes.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
            <span className="text-foreground/80">{item}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={`/checkout?product=${productSlug}&tariff=${id}`}
        className={cn(
          "block w-full text-center py-3 px-4 rounded-xl font-semibold text-sm transition-colors",
          isFeatured
            ? "bg-primary text-white hover:bg-primary/90"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
      >
        Записаться
      </Link>
    </div>
  );
}
