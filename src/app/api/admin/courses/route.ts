import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, price, currency } = await req.json();

  if (!title || !description) {
    return NextResponse.json(
      { error: "Название и описание обязательны" },
      { status: 400 }
    );
  }

  const course = await prisma.course.create({
    data: {
      title,
      description,
      price: price || 0,
      currency: currency || "RUB",
    },
  });

  return NextResponse.json(course, { status: 201 });
}
