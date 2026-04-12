"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GripVertical, Pencil, Copy, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Product = {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
  order: number;
  priceKgs: number | null;
  priceUsd: number | null;
  tariffs: { id: string; name: string; priceKgs: number }[];
  _count: { orderItems: number };
};

function SortableRow({ product, onPublish, onDuplicate, onDelete }: {
  product: Product;
  onPublish: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const displayPrice = product.tariffs.length > 0
    ? `${product.tariffs[0].priceKgs.toLocaleString("ru-RU")} с`
    : product.priceKgs
      ? `${product.priceKgs.toLocaleString("ru-RU")} с`
      : "—";

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={cn(
        "border-b transition-colors hover:bg-muted/50",
        isDragging && "bg-muted opacity-70 shadow-lg"
      )}
    >
      <td className="py-3 px-3 w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </td>
      <td className="py-3 px-3">
        <div className="font-medium text-sm">{product.title}</div>
        <div className="text-xs text-muted-foreground">/{product.slug}</div>
      </td>
      <td className="py-3 px-3 text-sm">
        {product.tariffs.length > 0 ? (
          <div className="text-xs text-muted-foreground">
            {product.tariffs.length} тарифа
          </div>
        ) : (
          <span className="text-sm">{displayPrice}</span>
        )}
      </td>
      <td className="py-3 px-3">
        <Badge variant={product.isPublished ? "success" : "secondary"}>
          {product.isPublished ? "Опубликован" : "Черновик"}
        </Badge>
      </td>
      <td className="py-3 px-3 text-sm text-muted-foreground text-right">
        {product._count.orderItems}
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-1 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPublish(product.id)}
            title={product.isPublished ? "Снять с публикации" : "Опубликовать"}
          >
            {product.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(product.id)} title="Дублировать">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/products/${product.id}`} title="Редактировать">
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(product.id)}
            title="Удалить"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export function ProductsTable({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);
      const reordered = arrayMove(products, oldIndex, newIndex);

      setProducts(reordered);

      await fetch("/api/admin/products/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: reordered.map((p, i) => ({ id: p.id, order: i })),
        }),
      });
    },
    [products]
  );

  const handlePublish = async (id: string) => {
    setLoading(id);
    const res = await fetch(`/api/admin/products/${id}/publish`, { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isPublished: data.isPublished } : p))
      );
    }
    setLoading(null);
  };

  const handleDuplicate = async (id: string) => {
    setLoading(id);
    const res = await fetch(`/api/admin/products/${id}/duplicate`, { method: "POST" });
    if (res.ok) {
      router.refresh();
    }
    setLoading(null);
  };

  const handleDelete = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!confirm(`Удалить "${product?.title}"? Это действие нельзя отменить.`)) return;
    setLoading(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
    setLoading(null);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        Продуктов пока нет. Создайте первый!
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-muted-foreground text-xs uppercase tracking-wide">
            <th className="py-2 px-3 w-8" />
            <th className="py-2 px-3 text-left">Продукт</th>
            <th className="py-2 px-3 text-left">Цена</th>
            <th className="py-2 px-3 text-left">Статус</th>
            <th className="py-2 px-3 text-right">Заказов</th>
            <th className="py-2 px-3 text-right">Действия</th>
          </tr>
        </thead>
        <tbody>
          <SortableContext items={products.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            {products.map((product) => (
              <SortableRow
                key={product.id}
                product={product}
                onPublish={handlePublish}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </tbody>
      </table>
      {loading && (
        <div className="text-center py-2 text-xs text-muted-foreground">Обновление...</div>
      )}
    </DndContext>
  );
}
