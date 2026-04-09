"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LessonPlayer({
  lessonId,
  completed: initialCompleted,
}: {
  lessonId: string;
  completed: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleComplete() {
    setLoading(true);
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, completed: !completed }),
    });

    if (res.ok) {
      setCompleted(!completed);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <Button
      onClick={toggleComplete}
      variant={completed ? "secondary" : "default"}
      disabled={loading}
    >
      {completed ? "Урок пройден \u2713" : "Отметить как пройденный"}
    </Button>
  );
}
