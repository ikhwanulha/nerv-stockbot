import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test 1: Check env
    const dbUrl = process.env.DATABASE_URL || "NOT SET";
    const directUrl = process.env.DIRECT_URL || "NOT SET";
    
    // Test 2: Connect to DB
    await prisma.$connect();
    const result = await prisma.user.count();
    await prisma.$disconnect();
    
    return NextResponse.json({
      status: "ok",
      dbUrl: dbUrl.substring(0, 50) + "...",
      directUrl: directUrl.substring(0, 50) + "...",
      userCount: result,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "error",
      message: error.message?.substring(0, 300) || String(error),
      name: error.name,
    });
  }
}
