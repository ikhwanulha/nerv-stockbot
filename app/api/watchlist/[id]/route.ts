// API untuk menghapus saham dari watchlist berdasarkan ID WatchlistStock
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stockId = params.id;

    // Cari stock dan pastikan milik user
    const stock = await prisma.watchlistStock.findUnique({
      where: { id: stockId },
      include: {
        watchlist: {
          select: { userId: true },
        },
      },
    });

    if (!stock) {
      return NextResponse.json(
        { error: "Saham tidak ditemukan di watchlist" },
        { status: 404 }
      );
    }

    if (stock.watchlist.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.watchlistStock.delete({
      where: { id: stockId },
    });

    return NextResponse.json({ message: "Saham berhasil dihapus dari watchlist" });
  } catch (error) {
    console.error("Watchlist stock DELETE error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus saham dari watchlist" },
      { status: 500 }
    );
  }
}
