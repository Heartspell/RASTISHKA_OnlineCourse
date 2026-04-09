"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  isPublished: boolean;
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string | null;
  order: number;
  duration: number;
  isFree: boolean;
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [saving, setSaving] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState(false);

  const loadCourse = useCallback(async () => {
    const res = await fetch(`/api/admin/courses/${courseId}`);
    if (res.ok) {
      const data = await res.json();
      setCourse(data);
      setLessons(data.lessons || []);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  async function handleSaveCourse(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    await fetch(`/api/admin/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description"),
        price: parseFloat(formData.get("price") as string) || 0,
        currency: formData.get("currency"),
        isPublished: formData.get("isPublished") === "on",
      }),
    });

    setSaving(false);
    router.refresh();
  }

  async function handleAddLesson(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await fetch(`/api/admin/courses/${courseId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        description: formData.get("description") || "",
        videoUrl: formData.get("videoUrl") || "",
        isFree: formData.get("isFree") === "on",
      }),
    });

    if (res.ok) {
      setShowLessonForm(false);
      loadCourse();
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`, {
      method: "DELETE",
    });
    loadCourse();
  }

  if (!course) return <div className="p-6">Загрузка...</div>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Редактировать курс</h1>

      <form onSubmit={handleSaveCourse} className="space-y-4 mb-10">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Название
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={course.title}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            defaultValue={course.description}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="price" className="text-sm font-medium">
              Цена
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={course.price}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="currency" className="text-sm font-medium">
              Валюта
            </label>
            <select
              id="currency"
              name="currency"
              defaultValue={course.currency}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="RUB">RUB</option>
              <option value="UZS">UZS</option>
              <option value="KGS">KGS</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            name="isPublished"
            defaultChecked={course.isPublished}
            className="rounded"
          />
          <label htmlFor="isPublished" className="text-sm font-medium">
            Опубликован (виден в каталоге)
          </label>
        </div>

        <div className="flex gap-4 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/courses")}
          >
            Назад
          </Button>
        </div>
      </form>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Уроки ({lessons.length})</h2>
          <Button
            variant="outline"
            onClick={() => setShowLessonForm(!showLessonForm)}
          >
            {showLessonForm ? "Закрыть" : "Добавить урок"}
          </Button>
        </div>

        {showLessonForm && (
          <form
            onSubmit={handleAddLesson}
            className="rounded-lg border p-4 mb-4 space-y-3"
          >
            <input
              name="title"
              type="text"
              required
              placeholder="Название урока"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <textarea
              name="description"
              placeholder="Описание (необязательно)"
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <input
              name="videoUrl"
              type="url"
              placeholder="Ссылка на видео (Bunny Stream URL)"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-2">
              <input type="checkbox" id="isFree" name="isFree" />
              <label htmlFor="isFree" className="text-sm">
                Бесплатный превью
              </label>
            </div>
            <Button type="submit" size="sm">
              Добавить
            </Button>
          </form>
        )}

        <div className="space-y-2">
          {lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div>
                <span className="text-sm text-muted-foreground mr-2">
                  {i + 1}.
                </span>
                <span className="text-sm font-medium">{lesson.title}</span>
                {lesson.isFree && (
                  <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Бесплатно
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => handleDeleteLesson(lesson.id)}
              >
                Удалить
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
