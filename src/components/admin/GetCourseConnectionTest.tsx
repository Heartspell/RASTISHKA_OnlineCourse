"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle, Plug } from "lucide-react";

interface GetCourseConnectionTestProps {
  hasConfig: boolean;
}

export function GetCourseConnectionTest({ hasConfig }: GetCourseConnectionTestProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const testConnection = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/admin/integrations/getcourse/test", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message ?? "Соединение установлено успешно");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Ошибка соединения");
      }
    } catch {
      setStatus("error");
      setMessage("Ошибка сети");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Отправляет тестовый запрос к GetCourse API для проверки корректности настроек.
      </p>

      <Button
        onClick={testConnection}
        disabled={!hasConfig || status === "loading"}
        variant="outline"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Plug className="h-4 w-4 mr-2" />
        )}
        Проверить соединение
      </Button>

      {status === "success" && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          {message}
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <XCircle className="h-4 w-4" />
          {message}
        </div>
      )}
    </div>
  );
}
