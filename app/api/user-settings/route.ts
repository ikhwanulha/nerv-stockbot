// API untuk menyimpan & mengambil preferensi user
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Ambil settings user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let settings = await prisma.userSetting.findUnique({
      where: { userId: session.user.id },
    });

    // Jika belum ada, buat default
    if (!settings) {
      settings = await prisma.userSetting.create({
        data: {
          userId: session.user.id,
          theme: "default",
          fontSize: "medium",
          tickerEnabled: true,
          sidebarOpen: true,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("User settings GET error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil pengaturan" },
      { status: 500 }
    );
  }
}

// PUT: Update settings user
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Validasi field yang diizinkan
    const allowedFields = [
      "theme",
      "fontSize",
      "tickerEnabled",
      "sidebarOpen",
      "layout",
      "enabledWidgets",
      "widgetOrder",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Tidak ada data yang diupdate" }, { status: 400 });
    }

    const settings = await prisma.userSetting.upsert({
      where: { userId: session.user.id },
      update: updateData,
      create: {
        userId: session.user.id,
        ...updateData,
      } as any,
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("User settings PUT error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan" },
      { status: 500 }
    );
  }
}
