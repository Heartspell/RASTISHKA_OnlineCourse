"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Enrollment {
  id: string;
  status: string;
  enrolledAt: string;
  user: { name: string; email: string };
  course: { title: string };
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
}

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/enrollments")
      .then((r) => r.json())
      .then(setEnrollments);
    fetch("/api/admin/users-list")
      .then((r) => r.json())
      .then(setUsers);
    fetch("/api/admin/courses-list")
      .then((r) => r.json())
      .then(setCourses);
  }, []);

  async function handleEnroll(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: formData.get("userId"),
        courseId: formData.get("courseId"),
      }),
    });

    if (res.ok) {
      const updated = await fetch("/api/admin/enrollments").then((r) =>
        r.json()
      );
      setEnrollments(updated);
      setShowForm(false);
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Записи на курсы</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Закрыть" : "Записать ученика"}
        </Button>
      </div>

      {showForm && (
        <form
          onSubmit={handleEnroll}
          className="rounded-lg border p-4 mb-6 space-y-4 max-w-md"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">Ученик</label>
            <select
              name="userId"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Выберите ученика</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Курс</label>
            <select
              name="courseId"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Выберите курс</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Запись..." : "Записать"}
          </Button>
        </form>
      )}

      <div className="rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium">Ученик</th>
              <th className="text-left p-3 font-medium">Email</th>
              <th className="text-left p-3 font-medium">Курс</th>
              <th className="text-left p-3 font-medium">Статус</th>
              <th className="text-left p-3 font-medium">Дата записи</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-3 text-center text-muted-foreground">
                  Записей пока нет
                </td>
              </tr>
            ) : (
              enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{enrollment.user.name}</td>
                  <td className="p-3 text-muted-foreground">
                    {enrollment.user.email}
                  </td>
                  <td className="p-3">{enrollment.course.title}</td>
                  <td className="p-3">
                    <span className="text-green-600">
                      {enrollment.status === "ACTIVE" ? "Активна" : enrollment.status}
                    </span>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(enrollment.enrolledAt).toLocaleDateString("ru-RU")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
