import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock } from "lucide-react";

interface CourseCardProps {
  slug: string;
  title: string;
  shortDescription: string;
  thumbnailUrl?: string | null;
  durationLabel?: string | null;
  priceKgs?: number | null;
  priceUsd?: number | null;
  tariffs?: { priceKgs: number; priceUsd: number }[];
}

export function CourseCard({
  slug,
  title,
  shortDescription,
  thumbnailUrl,
  durationLabel,
  priceKgs,
  priceUsd,
  tariffs,
}: CourseCardProps) {
  const minPriceKgs = tariffs && tariffs.length > 0
    ? Math.min(...tariffs.map((t) => t.priceKgs))
    : priceKgs;
  const minPriceUsd = tariffs && tariffs.length > 0
    ? Math.min(...tariffs.map((t) => t.priceUsd))
    : priceUsd;

  return (
    <Link
      href={`/courses/${slug}`}
      className="group flex flex-col bg-white rounded-2xl shadow-sm border border-border hover:shadow-md hover:border-primary/30 transition-all duration-200 overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-violet-100 to-indigo-100 overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-40">🧒</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{shortDescription}</p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          {/* Price */}
          <div>
            {minPriceKgs ? (
              <div>
                <span className="text-xs text-muted-foreground">от </span>
                <span className="font-bold text-primary">
                  {minPriceKgs.toLocaleString("ru-RU")} с
                </span>
                {minPriceUsd && (
                  <span className="text-xs text-muted-foreground ml-1">/ ${minPriceUsd}</span>
                )}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">Цена по запросу</span>
            )}
          </div>

          {/* Duration + Arrow */}
          <div className="flex items-center gap-2">
            {durationLabel && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {durationLabel}
              </span>
            )}
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
