import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const account = process.env.GETCOURSE_ACCOUNT;
  const apiKey = process.env.GETCOURSE_API_KEY;

  if (!account || !apiKey) {
    return NextResponse.json(
      { success: false, error: "GETCOURSE_ACCOUNT или GETCOURSE_API_KEY не настроен в .env" },
      { status: 400 }
    );
  }

  try {
    const params = Buffer.from(
      JSON.stringify({
        user: {
          email: "test-connection@example.com",
          first_name: "Test",
        },
        system: { refresh_if_exists: 0, return_user_id: "Y" },
      })
    ).toString("base64");

    const body = new URLSearchParams({
      action: "check",
      key: apiKey,
      params,
    });

    const res = await fetch(`https://${account}.getcourse.ru/pl/api/users`, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `HTTP ${res.status}: ${res.statusText}` },
        { status: 400 }
      );
    }

    const data = await res.json();

    // GetCourse returns { success: false, error: "..." } on auth failure
    if (data.success === false) {
      return NextResponse.json(
        { success: false, error: data.error ?? "GetCourse вернул ошибку" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Соединение с ${account}.getcourse.ru установлено`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Неизвестная ошибка";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
