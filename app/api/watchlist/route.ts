// API Watchlist - CRUD untuk watchlist user
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Ambil semua watchlist milik user
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const watchlistId = searchParams.get("watchlistId");

  try {
    if (watchlistId) {
      // Ambil satu watchlist beserta stocks-nya
      const watchlist = await prisma.watchlist.findFirst({
        where: {
          id: watchlistId,
          userId: session.user.id,
        },
        include: {
          stocks: true,
        },
      });
      if (!watchlist) {
        return NextResponse.json({ error: "Watchlist tidak ditemukan" }, { status: 404 });
      }
      return NextResponse.json(watchlist);
    }

    // Ambil semua watchlist
    const watchlists = await prisma.watchlist.findMany({
      where: { userId: session.user.id },
      include: {
        stocks: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(watchlists);
  } catch (error) {
    console.error("Watchlist GET error:", error);
    return NextResponse.json({ error: "Gagal mengambil watchlist" }, { status: 500 });
  }
}

// POST: Tambah saham ke watchlist / buat watchlist baru
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { watchlistId, symbol, name } = await req.json();

    // Jika watchlistId diberikan, tambah saham ke watchlist yang sudah ada
    if (watchlistId && symbol) {
      const watchlist = await prisma.watchlist.findFirst({
        where: { id: watchlistId, userId: session.user.id },
      });

      if (!watchlist) {
        return NextResponse.json({ error: "Watchlist tidak ditemukan" }, { status: 404 });
      }

      // Cek duplikasi
      const existing = await prisma.watchlistStock.findUnique({
        where: {
          watchlistId_symbol: {
            watchlistId,
            symbol: symbol.toUpperCase(),
          },
        },
      });

      if (existing) {
        return NextResponse.json({ error: "Saham sudah ada di watchlist" }, { status: 400 });
      }

      const stock = await prisma.watchlistStock.create({
        data: {
          watchlistId,
          symbol: symbol.toUpperCase(),
        },
      });

      return NextResponse.json(stock, { status: 201 });
    }

    // Buat watchlist baru
    if (name) {
      const watchlist = await prisma.watchlist.create({
        data: {
          userId: session.user.id,
          name,
        },
      });
      return NextResponse.json(watchlist, { status: 201 });
    }

    return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
  } catch (error) {
    console.error("Watchlist POST error:", error);
    return NextResponse.json({ error: "Gagal menambah watchlist" }, { status: 500 });
  }
}

// DELETE: Hapus watchlist
export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { watchlistId } = await req.json();

    if (!watchlistId) {
      return NextResponse.json({ error: "watchlistId diperlukan" }, { status: 400 });
    }

    const watchlist = await prisma.watchlist.findFirst({
      where: { id: watchlistId, userId: session.user.id },
    });

    if (!watchlist) {
      return NextResponse.json({ error: "Watchlist tidak ditemukan" }, { status: 404 });
    }

    await prisma.watchlist.delete({
      where: { id: watchlistId },
    });

    return NextResponse.json({ message: "Watchlist berhasil dihapus" });
  } catch (error) {
    console.error("Watchlist DELETE error:", error);
    return NextResponse.json({ error: "Gagal menghapus watchlist" }, { status: 500 });
  }
}
