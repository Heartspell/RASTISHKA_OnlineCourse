"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, AtSign, MessageCircle, Send } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

const schema = z.object({
  instagramUrl: z.string().optional(),
  whatsappUrl: z.string().optional(),
  telegramUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  metaPixelId: z.string().optional(),
  yandexMetricaId: z.string().optional(),
  gaId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface SettingsFormProps {
  initialData: {
    instagramUrl?: string | null;
    whatsappUrl?: string | null;
    telegramUrl?: string | null;
    heroImageUrl?: string | null;
    metaPixelId?: string | null;
    yandexMetricaId?: string | null;
    gaId?: string | null;
  };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      instagramUrl: initialData.instagramUrl ?? "",
      whatsappUrl: initialData.whatsappUrl ?? "",
      telegramUrl: initialData.telegramUrl ?? "",
      heroImageUrl: initialData.heroImageUrl ?? "",
      metaPixelId: initialData.metaPixelId ?? "",
      yandexMetricaId: initialData.yandexMetricaId ?? "",
      gaId: initialData.gaId ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
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

      {/* Social links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Социальные сети и контакты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="instagramUrl" className="flex items-center gap-2">
              <AtSign className="h-4 w-4" /> Instagram
            </Label>
            <Input
              id="instagramUrl"
              {...register("instagramUrl")}
              placeholder="https://instagram.com/svetlana__masalova"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsappUrl" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Label>
            <Input
              id="whatsappUrl"
              {...register("whatsappUrl")}
              placeholder="https://wa.me/996509237134"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="telegramUrl" className="flex items-center gap-2">
              <Send className="h-4 w-4" /> Telegram
            </Label>
            <Input
              id="telegramUrl"
              {...register("telegramUrl")}
              placeholder="https://t.me/SvetLanaVen"
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Главная страница</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Фото автора (хиро-блок)</Label>
            <ImageUpload
              value={watch("heroImageUrl") ?? ""}
              onChange={(url) => setValue("heroImageUrl", url)}
              aspect="video"
              label="Фото автора"
            />
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Аналитика</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="yandexMetricaId">ID Яндекс.Метрики</Label>
              <Input
                id="yandexMetricaId"
                {...register("yandexMetricaId")}
                placeholder="12345678"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gaId">Google Analytics ID</Label>
              <Input id="gaId" {...register("gaId")} placeholder="G-XXXXXXXXXX" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="metaPixelId">Meta Pixel ID</Label>
              <Input id="metaPixelId" {...register("metaPixelId")} placeholder="1234567890" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end items-center">
        {saved && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Настройки сохранены
          </span>
        )}
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Сохранить настройки
        </Button>
      </div>
    </form>
  );
}
