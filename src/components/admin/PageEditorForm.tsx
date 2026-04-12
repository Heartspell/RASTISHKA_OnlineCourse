"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Loader2, CheckCircle } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Обязательно"),
  content: z.string(),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface PageEditorFormProps {
  slug: string;
  initialData: {
    title: string;
    content: string;
    seoTitle?: string | null;
    seoDesc?: string | null;
  };
}

export function PageEditorForm({ slug, initialData }: PageEditorFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData.title,
      content: initialData.content,
      seoTitle: initialData.seoTitle ?? "",
      seoDesc: initialData.seoDesc ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        setError("Ошибка сохранения");
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Ошибка соединения");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Контент страницы</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Заголовок страницы *</Label>
            <Input id="title" {...register("title")} placeholder="Заголовок" />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Содержимое</Label>
            <RichTextEditor
              value={watch("content") ?? ""}
              onChange={(v) => setValue("content", v)}
              placeholder="Содержимое страницы..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO-настройки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="seoTitle">SEO-заголовок</Label>
            <Input
              id="seoTitle"
              {...register("seoTitle")}
              placeholder="Заголовок для поисковиков (до 60 символов)"
            />
            <p className="text-xs text-muted-foreground">
              Если пусто — используется заголовок страницы
            </p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="seoDesc">SEO-описание</Label>
            <Textarea
              id="seoDesc"
              {...register("seoDesc")}
              placeholder="Описание для поисковиков (до 160 символов)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end items-center">
        {saved && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Сохранено
          </span>
        )}
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Сохранить
        </Button>
      </div>
    </form>
  );
}
